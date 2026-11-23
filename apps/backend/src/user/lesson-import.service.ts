import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
// Runtime code from the shared lib is imported by path: tsc does not rewrite the alias.
import { splitTextName } from "../../../../libs/contracts/src/lib/files";
import { isCourseSlug, isRepoName } from "../../../../libs/contracts/src/lib/validation";
import { env } from "../app/env";
import {
  lessonTitleFrom,
  planImport,
  RepoEntry,
  thumbnailText,
  toEditorLessonData,
  toEditorMarkdown,
} from "../github/import-lesson";
import { GithubService } from "../github/github.service";
import { gitBlobSha } from "../github/submission-files";
import { FileStore, Lesson } from "../lesson/lesson.entity";
import { User } from "./user.entity";

export interface ImportResult {
  lessonId: number;
  /** True when the user already had an unsubmitted copy, which is opened instead of a new one. */
  existing: boolean;
  /**
   * The text to photograph for the copy's thumbnail while it still has none, otherwise null.
   * Also for an existing copy: the first import's answer can be lost to a reload.
   */
  thumbnailFrom: string | null;
}

/** The one-byte preview.png a lesson starts with, until its first thumbnail is taken. */
const isPlaceholder = (content: Buffer) => content.length <= 1;

const stem = (name: string) => name.slice(0, name.lastIndexOf("."));
const ext = (name: string) => name.slice(name.lastIndexOf("."));

/**
 * Copies a published lesson from kodeklubben/oppgaver into a new lesson owned by the user, as
 * described in docs/rediger-oppgave.md. Reads only; nothing is written to GitHub.
 */
@Injectable()
export class LessonImportService {
  constructor(
    @InjectRepository(Lesson) private lessonRepository: Repository<Lesson>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(FileStore) private fileStoreRepository: Repository<FileStore>,
    private githubService: GithubService,
  ) {}

  async importLesson(
    userId: number,
    accessToken: string | undefined,
    request: { course: string; lesson: string; courseTitle?: string },
  ): Promise<ImportResult> {
    const { course, lesson } = request;
    if (!isCourseSlug(course) || !isRepoName(lesson)) {
      throw new BadRequestException("Ukjent kurs eller oppgave");
    }
    if (!accessToken) throw new UnauthorizedException("Missing GitHub authorization");
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) throw new HttpException("User does not exist", HttpStatus.NOT_FOUND);

    const upstreamPath = ["src", course, lesson].join("/");
    const existing = await this.lessonRepository.findOne({
      where: { upstream_path: upstreamPath, created_by_id: userId, submitted: false },
    });
    if (existing) {
      const files = await this.fileStoreRepository.find({
        select: { filename: true, ext: true, content: true, upstream_sha: true },
        where: { lesson: { lessonId: existing.lessonId }, ext: In([".md", ".png"]) },
      });
      const preview = files.find((file) => file.filename === "preview" && file.ext === ".png");
      const needsThumbnail = !preview || (!preview.upstream_sha && isPlaceholder(preview.content));
      return {
        lessonId: existing.lessonId,
        existing: true,
        thumbnailFrom: needsThumbnail
          ? thumbnailText(files.filter((file) => file.ext === ".md").map((file) => file.filename))
          : null,
      };
    }

    const octokit = this.githubService.createClient(accessToken);
    const upstream = { owner: env("GH_LESSON_REPO_OWNER"), repo: env("GH_LESSON_REPO") };
    const branch = await this.githubService.defaultBranch(octokit, upstream);

    let entries: RepoEntry[];
    try {
      const { data } = await octokit.repos.getContent({
        ...upstream,
        path: upstreamPath,
        ref: branch.commitSha,
      });
      if (!Array.isArray(data)) throw Object.assign(new Error("Not a folder"), { status: 404 });
      entries = data.map(({ name, sha, size, type }) => ({ name, sha, size, type }));
    } catch (e) {
      if ((e as { status?: number }).status === 404) {
        throw new NotFoundException(`Fant ikke oppgaven ${course}/${lesson}.`);
      }
      throw e;
    }

    const plan = planImport(entries);
    if (!plan.ok) throw new UnprocessableEntityException(plan.reason);

    const contents = await Promise.all(
      plan.files.map(async (entry) => {
        const { data } = await octokit.git.getBlob({ ...upstream, file_sha: entry.sha });
        return { entry, buffer: Buffer.from(data.content, "base64") };
      }),
    );

    const stored: FileStore[] = contents.map(({ entry, buffer }) => {
      let content = buffer;
      if (ext(entry.name) === ".md") {
        const { language } = splitTextName(stem(entry.name));
        content = Buffer.from(toEditorMarkdown(buffer.toString("utf-8"), language), "utf-8");
      } else if (entry.name === "lesson.yml") {
        content = Buffer.from(toEditorLessonData(buffer.toString("utf-8")), "utf-8");
      }
      return Object.assign(new FileStore(), {
        filename: entry.name === "lesson.yml" ? "lesson" : stem(entry.name),
        ext: ext(entry.name).toLowerCase(),
        content,
        created_by: user.username,
        updated_by: user.username,
        upstream_sha: entry.sha,
        imported_sha: gitBlobSha(content),
      });
    });
    // Without one in the repo: a placeholder until the first thumbnail is taken, never submitted.
    const hasPreview = plan.files.some((entry) => entry.name === "preview.png");
    if (!hasPreview) stored.push(
      Object.assign(new FileStore(), {
        filename: "preview",
        ext: ".png",
        content: Buffer.from(" "),
        created_by: user.username,
        updated_by: user.username,
        upstream_sha: null,
        imported_sha: null,
      }),
    );

    const texts = contents
      .filter(({ entry }) => ext(entry.name) === ".md" && !entry.name.startsWith("README"))
      .map(({ entry, buffer }) => ({ name: entry.name, raw: buffer.toString("utf-8") }));
    const courseTitle =
      typeof request.courseTitle === "string" && request.courseTitle.trim()
        ? request.courseTitle.trim().slice(0, 200)
        : course;

    const lessonId = await this.lessonRepository.manager.transaction(async (manager) => {
      const saved = await manager.save(
        Lesson,
        Object.assign(new Lesson(), {
          lessonSlug: plan.textBase,
          lessonTitle: lessonTitleFrom(texts, plan.textBase),
          courseSlug: course,
          courseTitle,
          submitted: false,
          submitted_at: null,
          created_by: user.username,
          created_by_id: user.userId,
          updated_by: user.username,
          upstream_path: upstreamPath,
          upstream_commit: branch.commitSha,
        }),
      );
      await manager.save(
        FileStore,
        stored.map((file) => Object.assign(file, { lesson: saved })),
      );
      await manager
        .createQueryBuilder()
        .relation(User, "lessons")
        .of(user.userId)
        .add(saved.lessonId);
      return saved.lessonId;
    });
    return {
      lessonId,
      existing: false,
      thumbnailFrom: hasPreview
        ? null
        : thumbnailText(texts.map(({ name }) => stem(name)).filter(Boolean)),
    };
  }
}
