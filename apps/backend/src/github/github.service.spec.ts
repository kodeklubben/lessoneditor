import { commitMessage, GithubService } from "./github.service";
import { gitBlobSha, isPullRequestAlreadyExists } from "./submission-files";

describe("commit messages (V8)", () => {
  it("name the lesson and carry the submitter's message as the body", () => {
    expect(commitMessage("Hei", "  Ny oppgave om løkker\n")).toBe(
      "Oppgave fra Lesson Editor: Hei\n\nNy oppgave om løkker",
    );
    expect(commitMessage("Hei", "")).toBe("Oppgave fra Lesson Editor: Hei");
    expect(commitMessage("Hei")).toBe("Oppgave fra Lesson Editor: Hei");
  });
});

const md = (body: string) =>
  Buffer.from(`---\ntitle: Hei\nauthorList: [Ada]\nlanguage: nb\n---\n${body}`);

function fakeGithub(existingFiles: { path: string; content: Buffer }[], prError?: unknown) {
  const calls: Record<string, unknown[]> = {};
  const record =
    (name: string, result: (args: never) => unknown = () => ({})) =>
    async (args: never) => {
      (calls[name] ??= []).push(args);
      return { data: await result(args) };
    };
  const branchData = (name: string, sha: string) => ({
    name,
    commit: { sha, commit: { tree: { sha: `tree-${sha}` } } },
  });
  const octokit = {
    repos: {
      get: record("repos.get", () => ({ default_branch: "master" })),
      getBranch: record(
        "repos.getBranch",
        ({ owner, branch }: { owner: string; branch: string }) => {
          if (branch === "7" && !calls["git.createRef"])
            return Promise.reject(Object.assign(new Error("Not found"), { status: 404 }));
          return branchData(branch, owner === "kodeklubben" ? "upstream-sha" : "fork-sha");
        },
      ),
      createFork: record("repos.createFork", () => ({
        owner: { login: "ada" },
        name: "oppgaver",
        default_branch: "master",
      })),
      mergeUpstream: record("repos.mergeUpstream"),
      getContent: record("repos.getContent", () =>
        existingFiles.map(({ path, content }) => ({
          type: "file",
          path,
          sha: gitBlobSha(content),
        })),
      ),
    },
    git: {
      createRef: record("git.createRef"),
      createBlob: record("git.createBlob", () => ({ sha: "blob-sha" })),
      createTree: record("git.createTree", () => ({ sha: "new-tree" })),
      createCommit: record("git.createCommit", () => ({ sha: "new-commit" })),
      updateRef: record("git.updateRef"),
    },
    pulls: {
      create: prError
        ? async () => Promise.reject(prError)
        : record("pulls.create", () => ({
            html_url: "https://github.com/kodeklubben/oppgaver/pull/1",
          })),
      list: record("pulls.list", () => [
        { html_url: "https://github.com/kodeklubben/oppgaver/pull/9" },
      ]),
    },
  };
  return { octokit, calls };
}

describe("submitting a lesson to GitHub", () => {
  const env = { ...process.env };
  const lesson = {
    lessonId: 7,
    lessonSlug: "hei",
    lessonTitle: "Hei",
    courseSlug: "python",
    files: [
      { filename: "hei", ext: ".md", content: md("Ny tekst") },
      { filename: "uendret", ext: ".png", content: Buffer.from("png") },
    ],
  };
  const user = { userId: 1, username: "ada" };

  beforeEach(() => {
    process.env.DISABLE_PULL_REQUESTS = "false";
    process.env.GH_LESSON_REPO_OWNER = "kodeklubben";
    process.env.GH_LESSON_REPO = "oppgaver";
  });
  afterAll(() => {
    process.env = env;
  });

  function service(fake: ReturnType<typeof fakeGithub>) {
    const github = new GithubService();
    github.forkWaitMs = 0;
    const tokens: string[] = [];
    github.createClient = (token: string) => {
      tokens.push(token);
      return fake.octokit as never;
    };
    return { github, tokens };
  }

  it("branches from upstream, uploads only changes and deletes removed files", async () => {
    const fake = fakeGithub([
      { path: "src/python/hei/uendret.png", content: Buffer.from("png") },
      { path: "src/python/hei/slettet.png", content: Buffer.from("old") },
    ]);
    const { github } = service(fake);
    const result = await github.submitLesson(user as never, "token", lesson as never, {
      message: "Melding",
    });
    expect(result.url).toBe("https://github.com/kodeklubben/oppgaver/pull/1");
    expect(fake.calls["git.createRef"]).toEqual([
      { owner: "ada", repo: "oppgaver", ref: "refs/heads/7", sha: "upstream-sha" },
    ]);
    const tree = (
      fake.calls["git.createTree"][0] as { tree: { path: string; sha: string | null }[] }
    ).tree;
    expect(tree).toEqual([
      expect.objectContaining({ path: "src/python/hei/hei.md", sha: "blob-sha" }),
      expect.objectContaining({ path: "src/python/hei/slettet.png", sha: null }),
    ]);
    expect(fake.calls["pulls.create"][0]).toMatchObject({
      owner: "kodeklubben",
      repo: "oppgaver",
      head: "ada:7",
      base: "master",
      body: "Melding",
    });
  });

  it("reuses the open pull request, but does not hide other 422 errors", async () => {
    const exists = Object.assign(new Error("Validation Failed"), {
      status: 422,
      response: { data: { errors: [{ message: "A pull request already exists for ada:7." }] } },
    });
    const fake = fakeGithub([], exists);
    await expect(
      service(fake).github.submitLesson(user as never, "token", lesson as never, { message: "" }),
    ).resolves.toEqual({ url: "https://github.com/kodeklubben/oppgaver/pull/9" });

    const other = Object.assign(new Error("Validation Failed"), {
      status: 422,
      response: { data: { errors: [{ message: "No commits between master and 7" }] } },
    });
    const error = jest.spyOn(console, "error").mockImplementation(() => undefined);
    await expect(
      service(fakeGithub([], other)).github.submitLesson(user as never, "token", lesson as never, {
        message: "",
      }),
    ).rejects.toMatchObject({ status: 502 });
    error.mockRestore();
    expect(isPullRequestAlreadyExists(other)).toBe(false);
  });

  it("creates one client per submission with that user's token", async () => {
    const fake = fakeGithub([]);
    const { github, tokens } = service(fake);
    await Promise.all([
      github.submitLesson(user as never, "token-a", lesson as never, { message: "" }),
      github.submitLesson(user as never, "token-b", lesson as never, { message: "" }),
    ]);
    expect(tokens).toEqual(["token-a", "token-b"]);
  });

  it("tells the editor to log in again when GitHub rejects the token", async () => {
    const fake = fakeGithub([]);
    fake.octokit.repos.get = async () =>
      Promise.reject(Object.assign(new Error("Bad credentials"), { status: 401 }));
    const error = jest.spyOn(console, "error").mockImplementation(() => undefined);
    await expect(
      service(fake).github.submitLesson(user as never, "token", lesson as never, { message: "" }),
    ).rejects.toMatchObject({ status: 401 });
    error.mockRestore();
  });
});
