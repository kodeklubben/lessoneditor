import { ConflictException, Injectable, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { createHash } from "node:crypto";
import { Lesson, FileStore, isLessonOwner } from "./lesson.entity";
import { User } from "../user/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { NewFileDTO, ShareLessonDTO } from "@lessoneditor/contracts";
import { GithubService } from "../github/github.service";
import { thumbnailText } from "../github/import-lesson";
import { ThumbService } from "../thumb/thumb.service";
import { Request } from "express";

// Runtime code from the shared lib is imported by path: tsc does not rewrite the alias.
import { deletionBlocker, splitFilename } from "../../../../libs/contracts/src/lib/files";

const TEXT_EXTENSIONS = [".md", ".yml"];

/**
 * A text's version: the hash of what is stored. The editor sends back the version it started
 * from, so a save over a text someone else saved meanwhile (another tab, a co-author) is refused
 * instead of silently replacing it.
 */
export const contentVersion = (content: Buffer) => createHash("sha1").update(content).digest("hex");

export const EDITED_ELSEWHERE =
  "Teksten er endret et annet sted, i en annen fane eller av en du deler oppgaven med.";

/** For logs: the error's class and database code, never its message with parameters or data. */
export const errorKind = (error: unknown) =>
  [(error as Error)?.name ?? "Error", (error as { code?: string })?.code].filter(Boolean).join(" ");

/** bilde, bilde-2, bilde-3 …: a second upload with the same name must not shadow the first. */
export function uniqueFilename(wanted: string, taken: string[]): string {
  const names = new Set(taken);
  if (!names.has(wanted)) return wanted;
  let n = 2;
  while (names.has(`${wanted}-${n}`)) n++;
  return `${wanted}-${n}`;
}

@Injectable()
export class LessonService {
  private readonly logger = new Logger(LessonService.name);

  constructor(
    @InjectRepository(Lesson)
    private lessonRepository: Repository<Lesson>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(FileStore)
    private fileStoreRepository: Repository<FileStore>,
    private githubService: GithubService,
    private thumbService: ThumbService,
  ) {}

  async submitLesson(
    user: User,
    accessToken: string | undefined,
    lessonId: number,
    submitMessage: { message: string },
  ) {
    const lesson = await this.getLesson(lessonId);
    const result = await this.githubService.submitLesson(user, accessToken, lesson, submitMessage);
    await this.lessonRepository.update(lessonId, {
      submitted: true,
      submitted_at: new Date(),
    });
    return result;
  }

  async getLesson(lessonId: number): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({
      where: { lessonId },
      relations: { files: true, users: true },
    });
    if (lesson == null) {
      throw new HttpException("Lesson does not exist", HttpStatus.NOT_FOUND);
    }
    return lesson;
  }

  async getLessonFileNames(lessonId: number): Promise<string[]> {
    const lesson = await this.getLesson(lessonId);
    const filenames: string[] = lesson.files.map((file) => file.filename + file.ext);
    return filenames;
  }

  async addLessonUser(lessonId: number, shareLesson: ShareLessonDTO): Promise<void> {
    const invitedByUser = await this.userRepository.findOne({
      where: { userId: Number(shareLesson.invitationByUserId) },
    });
    if (!invitedByUser) {
      throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);
    }
    const invitedToUser = await this.userRepository.findOne({
      where: { userId: Number(shareLesson.invitationToUserId) },
      relations: { lessons: true },
    });

    if (!invitedToUser) {
      throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);
    }
    const lesson = await this.lessonRepository.findOne({ where: { lessonId } });
    if (!lesson) {
      throw new HttpException("Lesson does not exist", HttpStatus.NOT_FOUND);
    }
    //A lesson can only be shared by the creator
    if (!isLessonOwner(lesson, invitedByUser)) {
      throw new HttpException("Bare den som laget oppgaven, kan dele den.", HttpStatus.FORBIDDEN);
    }
    // Sharing twice is a no-op, not a duplicate key error from the join table.
    if (invitedToUser.lessons.some((existing) => existing.lessonId === lesson.lessonId)) return;
    invitedToUser.lessons.push(lesson);
    await this.userRepository.save(invitedToUser);
  }

  /**
   * Shares the lesson with a GitHub username (#337): what a teacher knows of a colleague. The
   * person must have signed in to the editor once, so there is a user to add.
   */
  async addLessonMemberByUsername(
    lessonId: number,
    invitedByUserId: number,
    username: string,
  ): Promise<void> {
    const invited = await this.userRepository
      .createQueryBuilder("user")
      .where("LOWER(user.username) = LOWER(:username)", { username })
      .getOne();
    if (!invited) {
      throw new HttpException(
        `Fant ingen bruker som heter «${username}». Personen må logge inn i Lesson Editor med GitHub én gang før oppgaven kan deles med dem.`,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.addLessonUser(lessonId, {
      invitationToUserId: String(invited.userId),
      invitationByUserId: String(invitedByUserId),
    });
  }

  /**
   * Takes someone off the lesson: the owner removes a member, a member can leave. The owner
   * stays, or the lesson would have no one who may share or delete it.
   */
  async removeLessonMember(lessonId: number, byUserId: number, memberId: number): Promise<void> {
    const lesson = await this.lessonRepository.findOne({ where: { lessonId } });
    const by = await this.userRepository.findOne({ where: { userId: byUserId } });
    const member = await this.userRepository.findOne({ where: { userId: memberId } });
    if (!lesson || !by || !member) {
      throw new HttpException("Fant ikke oppgaven eller brukeren.", HttpStatus.NOT_FOUND);
    }
    if (isLessonOwner(lesson, member)) {
      throw new ConflictException("Den som laget oppgaven, kan ikke fjernes fra den.");
    }
    if (byUserId !== memberId && !isLessonOwner(lesson, by)) {
      throw new HttpException(
        "Bare den som laget oppgaven, kan fjerne andre fra den.",
        HttpStatus.FORBIDDEN,
      );
    }
    await this.userRepository
      .createQueryBuilder()
      .relation(User, "lessons")
      .of(memberId)
      .remove(lessonId);
  }

  /**
   * "asteroids.png" finds that image; "asteroids" finds the text first. Lessons from
   * kodeklubben/oppgaver often have a text and an image with the same name (asteroids.md and
   * asteroids.png), so a name without extension cannot pick between them.
   */
  async getLessonFile(lessonId: number, filename: string) {
    const named = splitFilename(filename);
    const names = named.ext ? [named.filename, filename] : [filename];
    // Only the requested file: loading the lesson with all its files fetched every image's
    // content for each image the editor asked for.
    const candidates = await this.fileStoreRepository.find({
      where: names.map((name) => ({ lesson: { lessonId }, filename: name })),
    });
    const file =
      (named.ext &&
        candidates.find((file) => file.filename === named.filename && file.ext === named.ext)) ||
      candidates.find((file) => file.filename === filename && TEXT_EXTENSIONS.includes(file.ext)) ||
      candidates.find((file) => file.filename === filename);
    if (!file) {
      throw new HttpException("File does not exist", HttpStatus.NOT_FOUND);
    }
    return file;
  }

  async addLessonFile(
    lessonId: number,
    newFile: NewFileDTO,
    request: Request,
  ): Promise<{ fileId: number; filename: string; ext: string }> {
    const lesson = await this.lessonRepository.findOne({
      where: { lessonId },
      relations: { files: true },
    });
    if (!lesson) {
      throw new HttpException("Lesson does not exist", HttpStatus.NOT_FOUND);
    }
    const isImage = [".jpg", ".jpeg", ".gif", ".png"].includes(newFile.ext);
    // Files are fetched by name without extension, so names must be unique per lesson.
    const filename = uniqueFilename(
      newFile.filename,
      lesson.files.map((existing) => existing.filename),
    );
    if (filename !== newFile.filename && !isImage) {
      throw new HttpException("A text with this name already exists", HttpStatus.CONFLICT);
    }

    const file = new FileStore();
    const user = request.user as User;
    file.filename = filename;
    file.ext = newFile.ext;
    file.created_by = user.username ?? String(user.userId);
    file.updated_by = user.username ?? String(user.userId);
    file.lesson = lesson;

    if (isImage) {
      file.content = Buffer.from(newFile.content, "base64");
    } else {
      file.content = Buffer.from(newFile.content);
    }

    try {
      const savedFile = await this.fileStoreRepository.save(file, {
        transaction: true,
        chunk: 10,
      });
      return { fileId: savedFile.fileId, filename: savedFile.filename, ext: savedFile.ext };
    } catch (error) {
      // The error can carry the query parameters, i.e. the file itself: log only its kind.
      this.logger.error(`Saving a file in lesson ${lessonId} failed: ${errorKind(error)}`);
      throw new HttpException("Failed to save file", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Writes only this file's row. Saving the lesson with all its files (cascade) wrote every file
   * back as it was loaded, over a text another request had saved in the meantime.
   */
  async updateLessonFile(
    lessonId: number,
    filename: string,
    updatedByUserId: number,
    fileContent: string,
    baseVersion?: string,
  ): Promise<FileStore> {
    // Only texts are edited in place; an image with the same name must never be overwritten.
    const file = await this.fileStoreRepository.findOne({
      where: { lesson: { lessonId }, filename, ext: In(TEXT_EXTENSIONS) },
    });
    if (!file) {
      throw new HttpException("File does not exist", HttpStatus.NOT_FOUND);
    }
    const updatedByUser = await this.userRepository.findOne({ where: { userId: updatedByUserId } });
    if (!updatedByUser) {
      throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);
    }
    const changes = {
      content: Buffer.from(fileContent),
      updated_by: updatedByUser.username ?? String(updatedByUser.userId),
    };
    if (baseVersion !== undefined && baseVersion !== contentVersion(file.content)) {
      throw new ConflictException(EDITED_ELSEWHERE);
    }
    // With a base version, only while the row still holds what it was checked against: two saves
    // that pass the check at the same time cannot both win.
    const result = await this.fileStoreRepository.update(
      baseVersion === undefined
        ? { fileId: file.fileId }
        : { fileId: file.fileId, content: file.content },
      changes,
    );
    if (result.affected === 0) throw new ConflictException(EDITED_ELSEWHERE);
    await this.lessonRepository.update(lessonId, { updated_at: new Date() });
    return Object.assign(file, changes);
  }

  /** The editor was opened: a thumbnail follows the first save. */
  warmUpThumbnails(): void {
    this.thumbService.warmUp();
  }

  /**
   * Photographs a text and stores the picture with it, for its row on the lesson page. The main
   * text's picture (bokmål first) is also the lesson's preview.png, for its card and «Sende
   * inn»; a teacher guide or a translation never is (N5). The photo takes 6–20 s, so only those
   * rows are written afterwards: texts saved meanwhile stay as they are. A copy's own
   * preview.png from the repo is a picture the lesson shows, and is kept.
   */
  async updateThumbnail(lessonId: number, filename: string, request: Request): Promise<boolean> {
    const text = await this.fileStoreRepository.findOne({
      select: { fileId: true },
      where: { lesson: { lessonId }, filename, ext: ".md" },
    });
    if (!text) {
      throw new HttpException("File does not exist", HttpStatus.NOT_FOUND);
    }
    const texts = await this.fileStoreRepository.find({
      select: { filename: true },
      where: { lesson: { lessonId }, ext: ".md" },
    });
    const isMain = thumbnailText(texts.map((file) => file.filename)) === filename;
    const preview = isMain
      ? await this.fileStoreRepository.findOne({
          select: { fileId: true, upstream_sha: true },
          where: { lesson: { lessonId }, filename: "preview", ext: ".png" },
        })
      : null;
    let thumbImage: ArrayBuffer;
    try {
      thumbImage = await this.thumbService.getThumb(lessonId, filename, request);
    } catch {
      this.logger.warn(`Thumbnail request failed for lesson ${lessonId}`);
      throw new HttpException("Error generating thumbnail", HttpStatus.BAD_GATEWAY);
    }
    const content = Buffer.from(thumbImage);
    await this.fileStoreRepository.update(text.fileId, { thumbnail: content });
    if (!isMain || preview?.upstream_sha) return true;
    if (preview) {
      await this.fileStoreRepository.update(preview.fileId, { content });
    } else {
      const username = (request.user as User)?.username ?? "";
      await this.fileStoreRepository.insert({
        filename: "preview",
        ext: ".png",
        content,
        created_by: username,
        updated_by: username,
        lesson: { lessonId } as Lesson,
      });
    }
    return true;
  }

  /**
   * The main text to photograph when the lesson still has only the one-byte placeholder (or no
   * preview.png), otherwise undefined: then nothing needs doing (9f).
   */
  async textForMissingPreview(lessonId: number): Promise<string | undefined> {
    const preview = await this.fileStoreRepository.findOne({
      select: { fileId: true, content: true, upstream_sha: true },
      where: { lesson: { lessonId }, filename: "preview", ext: ".png" },
    });
    if (preview && (preview.upstream_sha || preview.content.length > 1)) return undefined;
    return this.mainText(lessonId);
  }

  /** The lesson's main text (bokmål first); undefined without texts. */
  async mainText(lessonId: number): Promise<string | undefined> {
    const texts = await this.fileStoreRepository.find({
      select: { filename: true },
      where: { lesson: { lessonId }, ext: ".md" },
    });
    return thumbnailText(texts.map((file) => file.filename)) ?? undefined;
  }

  /** A text's own thumbnail, or null when it has none yet. */
  async textThumbnail(lessonId: number, filename: string): Promise<Buffer | null> {
    const text = await this.fileStoreRepository.findOne({
      select: { fileId: true, thumbnail: true },
      where: { lesson: { lessonId }, filename, ext: ".md" },
    });
    if (!text) throw new HttpException("File does not exist", HttpStatus.NOT_FOUND);
    return text.thumbnail ?? null;
  }

  async deleteLessonFile(lessonId: number, filename: string, ext: string): Promise<number> {
    const lesson = await this.getLesson(lessonId);
    const file = lesson.files.find((file) => file.filename === filename && file.ext === `.${ext}`);

    if (!file) {
      throw new HttpException("File does not exist", HttpStatus.NOT_FOUND);
    }
    const blocker = deletionBlocker(file, lesson.files);
    if (blocker) throw new ConflictException(blocker);
    const deletedFileRes = await this.fileStoreRepository.delete(file.fileId);
    return deletedFileRes.affected ?? 0;
  }
}
