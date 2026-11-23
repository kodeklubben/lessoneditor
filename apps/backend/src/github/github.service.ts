import {
  Injectable,
  BadGatewayException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpException,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import {
  isCourseSlug,
  isLessonSlug,
  isRepoName,
} from "../../../../libs/contracts/src/lib/validation";
import { Octokit } from "@octokit/rest";
import { Lesson } from "../lesson/lesson.entity";
import { User } from "../user/user.entity";
import {
  buildChangedUploads,
  buildUploadFiles,
  changedInRepo,
  changedUploads,
  keepRepoFrontMatter,
  isPullRequestAlreadyExists,
  machineTranslationNote,
  pathsToDelete,
  RepoFile,
} from "./submission-files";
import { env } from "../app/env";
import type { LessonPullRequest } from "@lessoneditor/contracts";

type Repo = { owner: string; repo: string };
type Branch = { name: string; commitSha: string; treeSha: string };

/** src/<course>/<lesson> of a copied lesson, checked again before it becomes a path in the repo. */
export function isUpstreamPath(path: string): boolean {
  const [src, course, lesson, ...rest] = path.split("/");
  return src === "src" && isCourseSlug(course) && isRepoName(lesson) && rest.length === 0;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** «Oppgave fra Lesson Editor: <title>», with the submitter's message as the body when given. */
export function commitMessage(title: string, message?: string): string {
  const subject = `Oppgave fra Lesson Editor: ${title}`;
  const body = (message ?? "").trim();
  return body ? `${subject}\n\n${body}` : subject;
}

/** For a new lesson whose folder is taken by a published lesson (src/scratch/asteroids). */
export const publishedLessonMessage = (folder: string, submitting = false) =>
  `Det finnes allerede en publisert oppgave i ${folder}. ` +
  (submitting
    ? "Innsendingen ville erstattet den. Lag en ny oppgave med et annet navn og kopier teksten dit, " +
      "eller bruk «Rediger oppgaven» på den publiserte."
    : "Bruk «Rediger oppgaven» på den, eller velg et annet navn.");

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);

  /** Polling for a new fork: GitHub creates it asynchronously. */
  forkWaitMs = 2000;
  forkWaitAttempts = 15;

  /** A new client per submission: a shared instance mixed up tokens between concurrent users. */
  createClient(accessToken: string): Octokit {
    return new Octokit({ auth: accessToken });
  }

  /**
   * Commits the lesson to src/<course>/<lesson>/ on branch <lessonId> in the user's fork and opens
   * (or reuses) the PR. A copy of a published lesson sends only its changed and new files, and
   * deletes nothing (docs/rediger-oppgave.md).
   */
  async submitLesson(
    user: User,
    accessToken: string | undefined,
    lesson: Lesson,
    submitMessage: { message: string },
  ): Promise<{ url: string | null }> {
    if (process.env.DISABLE_PULL_REQUESTS !== "false") {
      throw new ForbiddenException("GitHub submission is disabled in this environment");
    }
    if (!accessToken) {
      throw new UnauthorizedException("Missing GitHub authorization");
    }
    const copy = lesson.upstream_path ?? null;
    // Checked again here: older rows were stored before slugs were validated.
    if (
      copy
        ? !isUpstreamPath(copy)
        : !isCourseSlug(lesson.courseSlug) || !isLessonSlug(lesson.lessonSlug)
    ) {
      throw new BadRequestException("The lesson or course slug cannot be used as a path");
    }
    if (!lesson.files) {
      throw new BadRequestException("The lesson has no files");
    }
    const octokit = this.createClient(accessToken);
    const upstream: Repo = {
      owner: env("GH_LESSON_REPO_OWNER"),
      repo: env("GH_LESSON_REPO"),
    };
    try {
      const upstreamBranch = await this.defaultBranch(octokit, upstream);
      const lessonPath = copy ?? ["src", lesson.courseSlug, lesson.lessonSlug].join("/");
      // A new lesson's first submission branches from the repo: a published lesson in its folder
      // would be replaced, its other files deleted. After a submission the folder can be the
      // lesson's own merged pull request.
      if (!copy && !lesson.submitted && !lesson.submitted_at) {
        const published = await this.listFiles(octokit, upstream, upstreamBranch.name, lessonPath);
        if (published.length > 0) {
          throw new ConflictException(publishedLessonMessage(lessonPath, true));
        }
      }

      let uploads;
      if (copy) {
        const changedSinceCopy = buildChangedUploads(lessonPath, lesson.files);
        if (changedSinceCopy.length === 0) {
          throw new BadRequestException("Ingen endringer å sende inn.");
        }
        const inRepo = await this.listFiles(octokit, upstream, upstreamBranch.name, lessonPath);
        const conflicts = changedInRepo(changedSinceCopy, inRepo);
        if (conflicts.length > 0) {
          throw new ConflictException(
            `Endret på GitHub etter at kopien ble laget: ${conflicts.join(", ")}. ` +
              "Lag en ny kopi og ta med endringene dine dit.",
          );
        }
        uploads = await Promise.all(
          changedSinceCopy.map(async ({ upload, upstreamSha }) => {
            if (!upstreamSha || !upload.path.endsWith(".md")) return upload;
            const { data } = await octokit.git.getBlob({ ...upstream, file_sha: upstreamSha });
            const original = Buffer.from(data.content, "base64").toString("utf-8");
            const text = keepRepoFrontMatter(original, upload.buffer.toString("utf-8"));
            return { ...upload, buffer: Buffer.from(text, "utf-8") };
          }),
        );
      } else {
        uploads = buildUploadFiles(lesson, lesson.files);
      }

      // The owner of the lesson repo (e.g. a test copy of it) works in it directly; anyone else
      // through their fork.
      const ownsRepo = user.username?.toLowerCase() === upstream.owner.toLowerCase();
      const fork = ownsRepo ? upstream : await this.ensureFork(octokit, upstream);
      const branch = await this.ensureBranch(
        octokit,
        fork,
        String(lesson.lessonId),
        upstreamBranch,
      );

      const existing = await this.listFiles(octokit, fork, branch.name, lessonPath);
      const changed = changedUploads(existing, uploads);
      // A copy never deletes: the repo has files it does not hold (code, subfolders).
      const deleted = copy ? [] : pathsToDelete(existing, uploads);

      if (changed.length > 0 || deleted.length > 0) {
        const blobs = await Promise.all(
          changed.map(async (upload) => ({
            path: upload.path,
            sha: (
              await octokit.git.createBlob({
                ...fork,
                content: upload.buffer.toString("base64"),
                encoding: "base64",
              })
            ).data.sha,
          })),
        );
        const tree = await octokit.git.createTree({
          ...fork,
          base_tree: branch.treeSha,
          tree: [
            ...blobs.map(({ path, sha }) => ({
              path,
              sha,
              mode: "100644" as const,
              type: "blob" as const,
            })),
            // sha: null removes the file from the tree.
            ...deleted.map((path) => ({
              path,
              sha: null,
              mode: "100644" as const,
              type: "blob" as const,
            })),
          ],
        });
        const commit = await octokit.git.createCommit({
          ...fork,
          message: commitMessage(lesson.lessonTitle, submitMessage?.message),
          tree: tree.data.sha,
          parents: [branch.commitSha],
        });
        await octokit.git.updateRef({ ...fork, ref: `heads/${branch.name}`, sha: commit.data.sha });
      }

      const pr = await this.ensurePullRequest(
        octokit,
        upstream,
        fork,
        branch.name,
        upstreamBranch.name,
        copy ? `Endringer i ${lesson.lessonTitle}` : lesson.lessonTitle,
        (submitMessage?.message ?? "") + machineTranslationNote(lesson.files),
      );
      // The card and the lesson page ask again right away; the old answer is stale now.
      this.pullRequestCache.delete(lesson.lessonId);
      return { url: pr?.html_url ?? null };
    } catch (error) {
      throw this.toHttpError(error);
    }
  }

  private pullRequestCache = new Map<number, { at: number; value: LessonPullRequest | null }>();
  /** GitHub is asked again after this long; a merge shows on the card within minutes. */
  pullRequestCacheMs = 5 * 60 * 1000;

  /**
   * The pull request a submitted lesson opened: the newest one from the branch <lessonId> in one
   * of the given forks (the lesson's members; the repo owner works in the repo itself). Null when
   * there is none.
   */
  async lessonPullRequest(
    accessToken: string,
    lessonId: number,
    owners: string[],
  ): Promise<LessonPullRequest | null> {
    const cached = this.pullRequestCache.get(lessonId);
    if (cached && Date.now() - cached.at < this.pullRequestCacheMs) return cached.value;
    const octokit = this.createClient(accessToken);
    const upstream = { owner: env("GH_LESSON_REPO_OWNER"), repo: env("GH_LESSON_REPO") };
    let newest:
      { created_at: string; merged_at: string | null; state: string; html_url: string } | undefined;
    for (const owner of new Set(owners)) {
      const { data } = await octokit.pulls.list({
        ...upstream,
        head: `${owner}:${lessonId}`,
        state: "all",
        sort: "created",
        direction: "desc",
        per_page: 1,
      });
      const pr = data[0];
      if (pr && (!newest || pr.created_at > newest.created_at)) newest = pr;
    }
    const value: LessonPullRequest | null = newest
      ? {
          state: newest.merged_at ? "merged" : newest.state === "open" ? "open" : "closed",
          url: newest.html_url,
        }
      : null;
    this.pullRequestCache.set(lessonId, { at: Date.now(), value });
    return value;
  }

  /** Whether the lesson repo's default branch has anything at this path. */
  async lessonFolderExists(accessToken: string, path: string): Promise<boolean> {
    const octokit = this.createClient(accessToken);
    try {
      await octokit.repos.getContent({
        owner: env("GH_LESSON_REPO_OWNER"),
        repo: env("GH_LESSON_REPO"),
        path,
      });
      return true;
    } catch (e) {
      if ((e as { status?: number }).status === 404) return false;
      throw e;
    }
  }

  /** GitHub errors become messages the editor can show, without tokens or request details. */
  toHttpError(error: unknown): HttpException {
    if (error instanceof HttpException) return error;
    const status = (error as { status?: number })?.status;
    this.logger.warn(`GitHub submission failed: ${status ?? "no status"}`);
    if (status === 401)
      return new UnauthorizedException("GitHub-innloggingen er utløpt. Logg inn på nytt.");
    if (status === 403 || status === 404)
      return new ForbiddenException(
        "GitHub ga ikke tilgang til å forke eller skrive til oppgaverepoet.",
      );
    return new BadGatewayException("GitHub svarte ikke som forventet. Prøv igjen litt senere.");
  }

  async defaultBranch(octokit: Octokit, repo: Repo): Promise<Branch> {
    const { data } = await octokit.repos.get(repo);
    const branch = await this.getBranch(octokit, repo, data.default_branch);
    if (!branch) throw new Error("The lesson repo has no default branch");
    return branch;
  }

  /** Creating a fork that exists returns the existing one, so this is safe to repeat. */
  async ensureFork(octokit: Octokit, upstream: Repo): Promise<Repo> {
    const { data } = await octokit.repos.createFork(upstream);
    const fork = { owner: data.owner.login, repo: data.name };
    for (let attempt = 0; attempt < this.forkWaitAttempts; attempt++) {
      if (await this.getBranch(octokit, fork, data.default_branch)) return fork;
      await sleep(this.forkWaitMs);
    }
    throw new Error("The fork was not ready in time");
  }

  async getBranch(octokit: Octokit, repo: Repo, branch: string): Promise<Branch | null> {
    try {
      const { data } = await octokit.repos.getBranch({ ...repo, branch });
      return { name: data.name, commitSha: data.commit.sha, treeSha: data.commit.commit.tree.sha };
    } catch (e) {
      if ((e as { status?: number }).status === 404) return null;
      throw e;
    }
  }

  /**
   * A new lesson branch starts from the upstream default branch, not from the fork's possibly
   * years old master. The fork is synced first so the upstream commit is reachable from it.
   */
  async ensureBranch(
    octokit: Octokit,
    fork: Repo,
    name: string,
    upstreamBranch: Branch,
  ): Promise<Branch> {
    const existing = await this.getBranch(octokit, fork, name);
    if (existing) return existing;
    let base = upstreamBranch;
    try {
      await octokit.repos.mergeUpstream({ ...fork, branch: upstreamBranch.name });
    } catch {
      // A diverged fork cannot be synced; fall back to its own default branch.
      base = (await this.getBranch(octokit, fork, upstreamBranch.name)) ?? upstreamBranch;
    }
    await octokit.git.createRef({ ...fork, ref: `refs/heads/${name}`, sha: base.commitSha });
    return { ...base, name };
  }

  async listFiles(octokit: Octokit, repo: Repo, ref: string, path: string): Promise<RepoFile[]> {
    try {
      const { data } = await octokit.repos.getContent({ ...repo, path, ref });
      return (Array.isArray(data) ? data : [])
        .filter((entry) => entry.type === "file")
        .map((entry) => ({ path: entry.path, sha: entry.sha }));
    } catch (e) {
      if ((e as { status?: number }).status === 404) return [];
      throw e;
    }
  }

  async ensurePullRequest(
    octokit: Octokit,
    upstream: Repo,
    fork: Repo,
    branch: string,
    base: string,
    title: string,
    body: string,
  ): Promise<{ html_url: string } | null> {
    const head = `${fork.owner}:${branch}`;
    try {
      return (await octokit.pulls.create({ ...upstream, title, head, base, body })).data;
    } catch (e) {
      if (!isPullRequestAlreadyExists(e)) throw e;
      const { data } = await octokit.pulls.list({ ...upstream, head, state: "open" });
      return data[0] ?? null;
    }
  }
}
