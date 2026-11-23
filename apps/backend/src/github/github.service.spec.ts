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
    // Submitted before: the folder is the lesson's own, from its earlier pull request.
    const again = { ...lesson, submitted: true, submitted_at: new Date() };
    const result = await github.submitLesson(user as never, "token", again as never, {
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

  it("never replaces a published lesson with a new one of the same name (P0-2)", async () => {
    const fake = fakeGithub([
      { path: "src/python/hei/hei.md", content: md("Publisert") },
      { path: "src/python/hei/kode.py", content: Buffer.from("print()") },
    ]);
    await expect(
      service(fake).github.submitLesson(user as never, "token", lesson as never, { message: "" }),
    ).rejects.toMatchObject({ status: 409, message: expect.stringContaining("src/python/hei") });
    expect(fake.calls["repos.createFork"]).toBeUndefined();
    expect(fake.calls["git.createTree"]).toBeUndefined();
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

describe("submitting a copy of a published lesson", () => {
  const env = { ...process.env };
  const original = Buffer.from(
    "---\ntitle: Asteroids\nlevel: 4\nauthor: ''\nauthorList: [Geir]\nlanguage: nb\n---\nTekst\n",
  );
  const copy = (
    files: { filename: string; ext: string; content: Buffer; imported?: boolean }[],
  ) => ({
    lessonId: 7,
    lessonSlug: "asteroids",
    lessonTitle: "Asteroids",
    courseSlug: "scratch",
    upstream_path: "src/scratch/asteroids",
    files: files.map(({ imported = true, ...file }) => ({
      ...file,
      imported_sha: imported ? gitBlobSha(file.content) : null,
      upstream_sha: imported ? "repo-" + file.filename + file.ext : null,
    })),
  });
  // What the repo had when the copy was made: the text, code the copy does not hold, an image.
  const repoAtCopy = [
    { path: "src/scratch/asteroids/asteroids.md", sha: "repo-asteroids.md" },
    { path: "src/scratch/asteroids/kode.py", sha: "repo-kode.py" },
  ];

  beforeEach(() => {
    process.env.DISABLE_PULL_REQUESTS = "false";
    process.env.GH_LESSON_REPO_OWNER = "kodeklubben";
    process.env.GH_LESSON_REPO = "oppgaver";
  });
  afterAll(() => {
    process.env = env;
  });

  function run(lesson: ReturnType<typeof copy>, username: string, repo = repoAtCopy) {
    const fake = fakeGithub([]);
    // The folder listing the repo answers with: its sha per file, not the content.
    (fake.octokit.repos as Record<string, unknown>).getContent = async () => ({
      data: repo.map((file) => ({ type: "file", ...file })),
    });
    // The text as it is in the repo, for keeping its front matter.
    (fake.octokit.git as Record<string, unknown>).getBlob = async () => ({
      data: {
        content: Buffer.from(
          "---\ntitle: Asteroids\nlevel: 4\nauthor: 'Geir'\nlanguage: nb\n---\nTekst\n",
        ).toString("base64"),
      },
    });
    const github = new GithubService();
    github.forkWaitMs = 0;
    github.createClient = () => fake.octokit as never;
    const submit = github.submitLesson({ userId: 1, username } as never, "token", lesson as never, {
      message: "Rettet en skrivefeil",
    });
    return { fake, submit };
  }

  it("sends only the changed text, keeps level, deletes nothing and names the PR", async () => {
    const lesson = copy([
      { filename: "asteroids", ext: ".md", content: original },
      { filename: "preview", ext: ".png", content: Buffer.from(" "), imported: false },
    ]);
    lesson.files[0].content = Buffer.from(original.toString().replace("Tekst", "Tekst, rettet"));
    const { fake, submit } = run(lesson, "ada");
    await submit;
    const tree = (
      fake.calls["git.createTree"][0] as { tree: { path: string; sha: string | null }[] }
    ).tree;
    expect(tree.map((entry) => [entry.path, entry.sha])).toEqual([
      ["src/scratch/asteroids/asteroids.md", "blob-sha"],
    ]);
    const blob = fake.calls["git.createBlob"][0] as { content: string };
    // The repo's own front matter text, quotes included; only the body changed.
    expect(Buffer.from(blob.content, "base64").toString()).toBe(
      "---\ntitle: Asteroids\nlevel: 4\nauthor: 'Geir'\nlanguage: nb\n---\nTekst, rettet\n",
    );
    expect(fake.calls["repos.createFork"]).toHaveLength(1);
    expect(fake.calls["pulls.create"][0]).toMatchObject({ title: "Endringer i Asteroids" });
  });

  it("works in the repo directly when the submitter owns it, as with a test copy", async () => {
    const lesson = copy([{ filename: "asteroids", ext: ".md", content: original }]);
    lesson.files[0].content = Buffer.from("---\ntitle: Ny\n---\nNy\n");
    const { fake, submit } = run(lesson, "Kodeklubben");
    await submit;
    expect(fake.calls["repos.createFork"]).toBeUndefined();
    expect(fake.calls["git.createRef"]).toEqual([
      expect.objectContaining({ owner: "kodeklubben", ref: "refs/heads/7" }),
    ]);
  });

  it("refuses when nothing changed", async () => {
    const { submit } = run(copy([{ filename: "asteroids", ext: ".md", content: original }]), "ada");
    await expect(submit).rejects.toThrow("Ingen endringer å sende inn.");
  });

  it("refuses to overwrite a file someone changed in the repo since the copy was made", async () => {
    const lesson = copy([{ filename: "asteroids", ext: ".md", content: original }]);
    lesson.files[0].content = Buffer.from("---\ntitle: Ny\n---\nNy\n");
    const { fake, submit } = run(lesson, "ada", [
      { path: "src/scratch/asteroids/asteroids.md", sha: "someone-else" },
    ]);
    await expect(submit).rejects.toThrow(
      "Endret på GitHub etter at kopien ble laget: asteroids.md",
    );
    expect(fake.calls["git.createTree"]).toBeUndefined();
  });
});

describe("a submitted lesson's pull request, for the card", () => {
  const env = { ...process.env };
  beforeEach(() => {
    process.env.GH_LESSON_REPO_OWNER = "kodeklubben";
    process.env.GH_LESSON_REPO = "oppgaver";
  });
  afterAll(() => {
    process.env = env;
  });

  const withPulls = (byHead: Record<string, object[]>) => {
    const github = new GithubService();
    const list = jest.fn(async ({ head }: { head: string }) => ({ data: byHead[head] ?? [] }));
    github.createClient = () => ({ pulls: { list } }) as never;
    return { github, list };
  };
  const pr = (created: string, state: string, merged: string | null) => ({
    created_at: created,
    state,
    merged_at: merged,
    html_url: `https://github.com/kodeklubben/oppgaver/pull/${created.slice(-2)}`,
  });

  it("says merged, open or closed, from the branch named after the lesson", async () => {
    const { github, list } = withPulls({
      "ada:31": [pr("2026-11-22T23:50", "closed", "2026-11-23T09:00")],
      "ada:32": [pr("2026-11-22T23:51", "open", null)],
      "ada:33": [pr("2026-11-22T23:52", "closed", null)],
    });
    expect(await github.lessonPullRequest("t", 31, ["ada"])).toEqual({
      state: "merged",
      url: "https://github.com/kodeklubben/oppgaver/pull/50",
    });
    expect((await github.lessonPullRequest("t", 32, ["ada"]))?.state).toBe("open");
    expect((await github.lessonPullRequest("t", 33, ["ada"]))?.state).toBe("closed");
    expect(list).toHaveBeenCalledWith(
      expect.objectContaining({
        owner: "kodeklubben",
        repo: "oppgaver",
        head: "ada:31",
        state: "all",
      }),
    );
    expect(await github.lessonPullRequest("t", 34, ["ada"])).toBeNull();
  });

  it("takes the newest one when several members submitted, and asks each fork once", async () => {
    const { github, list } = withPulls({
      "ada:7": [pr("2026-11-01T10:00", "closed", null)],
      "bo:7": [pr("2026-11-20T10:00", "open", null)],
    });
    expect((await github.lessonPullRequest("t", 7, ["ada", "bo", "ada"]))?.state).toBe("open");
    expect(list).toHaveBeenCalledTimes(2);
  });

  it("asks GitHub again only after a while", async () => {
    const { github, list } = withPulls({ "ada:8": [pr("2026-11-20T10:00", "open", null)] });
    await github.lessonPullRequest("t", 8, ["ada"]);
    await github.lessonPullRequest("t", 8, ["ada"]);
    expect(list).toHaveBeenCalledTimes(1);
    github.pullRequestCacheMs = 0;
    await github.lessonPullRequest("t", 8, ["ada"]);
    expect(list).toHaveBeenCalledTimes(2);
  });
});
