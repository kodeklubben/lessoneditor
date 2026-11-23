import { ConflictException, Injectable, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Lesson, FileStore, isLessonOwner } from "./lesson.entity";
import { User } from "../user/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { NewFileDTO, ShareLessonDTO } from "@lessoneditor/contracts";
import { GithubService } from "../github/github.service";
import { ThumbService } from "../thumb/thumb.service";
import { Request } from "express";

// Runtime code from the shared lib is imported by path: tsc does not rewrite the alias.
import { deletionBlocker, splitFilename } from "../../../../libs/contracts/src/lib/files";

const TEXT_EXTENSIONS = [".md", ".yml"];

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
      throw new HttpException("Lesson can only be shared by creator", HttpStatus.FORBIDDEN);
    }
    // Sharing twice is a no-op, not a duplicate key error from the join table.
    if (invitedToUser.lessons.some((existing) => existing.lessonId === lesson.lessonId)) return;
    invitedToUser.lessons.push(lesson);
    await this.userRepository.save(invitedToUser);
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
    await this.fileStoreRepository.update(file.fileId, changes);
    await this.lessonRepository.update(lessonId, { updated_at: new Date() });
    return Object.assign(file, changes);
  }

  /**
   * Photographs a text of the lesson and stores it as preview.png, which older lessons may lack.
   * The photo takes 15–20 s, so only the preview row is written afterwards: texts saved meanwhile
   * stay as they are. A copy's own preview.png from the repo is a picture the lesson shows, and
   * is kept (false).
   */
  async updateThumbnail(lessonId: number, filename: string, request: Request): Promise<boolean> {
    const text = await this.fileStoreRepository.findOne({
      select: { fileId: true },
      where: { lesson: { lessonId }, filename, ext: ".md" },
    });
    if (!text) {
      throw new HttpException("File does not exist", HttpStatus.NOT_FOUND);
    }
    const preview = await this.fileStoreRepository.findOne({
      select: { fileId: true, upstream_sha: true },
      where: { lesson: { lessonId }, filename: "preview", ext: ".png" },
    });
    if (preview?.upstream_sha) return false;
    let thumbImage: ArrayBuffer;
    try {
      thumbImage = await this.thumbService.getThumb(lessonId, filename, request);
    } catch {
      this.logger.warn(`Thumbnail request failed for lesson ${lessonId}`);
      throw new HttpException("Error generating thumbnail", HttpStatus.BAD_GATEWAY);
    }
    const content = Buffer.from(thumbImage);
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
