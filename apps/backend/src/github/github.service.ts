import {
  Injectable,
  BadGatewayException,
  BadRequestException,
  ForbiddenException,
  HttpException,
  UnauthorizedException,
} from "@nestjs/common";
import { isCourseSlug, isLessonSlug } from "../../../../libs/contracts/src/lib/validation";
import { Octokit } from "@octokit/rest";
import { Lesson } from "../lesson/lesson.entity";
import { User } from "../user/user.entity";
import {
  buildUploadFiles,
  changedUploads,
  isPullRequestAlreadyExists,
  pathsToDelete,
  RepoFile,
} from "./submission-files";

type Repo = { owner: string; repo: string };
type Branch = { name: string; commitSha: string; treeSha: string };

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

@Injectable()
export class GithubService {
  /** Polling for a new fork: GitHub creates it asynchronously. */
  forkWaitMs = 2000;
  forkWaitAttempts = 15;

  /** A new client per submission: a shared instance mixed up tokens between concurrent users. */
  createClient(accessToken: string): Octokit {
    return new Octokit({ auth: accessToken });
  }

  /** Commits the lesson to src/<course>/<lesson>/ on branch <lessonId> in the user's fork and opens (or reuses) the PR. */
  async submitLesson(
    user: User,
    accessToken: string,
    lesson: Lesson,
    submitMessage: { message: string },
  ): Promise<{ url: string | null }> {
    if (process.env.DISABLE_PULL_REQUESTS !== "false") {
      throw new ForbiddenException("GitHub submission is disabled in this environment");
    }
    if (!accessToken) {
      throw new UnauthorizedException("Missing GitHub authorization");
    }
    // Checked again here: older rows were stored before slugs were validated.
    if (!isCourseSlug(lesson.courseSlug) || !isLessonSlug(lesson.lessonSlug)) {
      throw new BadRequestException("The lesson or course slug cannot be used as a path");
    }
    if (!lesson.files) {
      throw new BadRequestException("The lesson has no files");
    }
    const octokit = this.createClient(accessToken);
    const upstream: Repo = {
      owner: process.env.GH_LESSON_REPO_OWNER,
      repo: process.env.GH_LESSON_REPO,
    };
    try {
      const upstreamBranch = await this.defaultBranch(octokit, upstream);
      const fork = await this.ensureFork(octokit, upstream);
      const branch = await this.ensureBranch(
        octokit,
        fork,
        String(lesson.lessonId),
        upstreamBranch,
      );

      const lessonPath = ["src", lesson.courseSlug, lesson.lessonSlug].join("/");
      const uploads = buildUploadFiles(lesson, lesson.files);
      const existing = await this.listFiles(octokit, fork, branch.name, lessonPath);
      const changed = changedUploads(existing, uploads);
      const deleted = pathsToDelete(existing, uploads);

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
          message: `Oppgave fra Lesson Editor: ${lesson.lessonTitle}`,
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
        lesson.lessonTitle,
        submitMessage?.message ?? "",
      );
      return { url: pr?.html_url ?? null };
    } catch (error) {
      throw this.toHttpError(error);
    }
  }

  /** GitHub errors become messages the editor can show, without tokens or request details. */
  toHttpError(error: unknown): HttpException {
    if (error instanceof HttpException) return error;
    const status = (error as { status?: number })?.status;
    console.error("GitHub submission failed:", status ?? "no status");
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
      if (e.status === 404) return null;
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
      if (e.status === 404) return [];
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
