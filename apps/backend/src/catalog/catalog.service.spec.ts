import { CatalogService } from "./catalog.service";

describe("courses and tags from the lesson repo (#335)", () => {
  const env = { ...process.env };
  const files: Record<string, string> = {
    "src/microbit/course.yml": "isExternal: false\n",
    "src/microbit/index.md": '---\ntitle: "Micro:bit"\n---\nTekst',
    "src/scratchjr/course.yml": "isExternal: false\n",
    "src/scratchjr/index.md": "---\ntitle: ScratchJr\n---\n",
    "src/codecademy/course.yml": "isExternal: true\n",
    "src/codecademy/index.md": "---\ntitle: Codecademy\n---\n",
    "filtertags/keys.yml":
      "topic:\n  - web\n  - app\nsubject:\n  - mathematics\ngrade:\n  - primary\n  - junior\n",
    "filtertags/translation_nb.yml":
      "topic:\n  TAGS:\n    web:\n      NAME: Nettside\n    app:\n      NAME: App\nsubject:\n  TAGS:\n    mathematics:\n      NAME: Matematikk\ngrade:\n  TAGS:\n    primary:\n      NAME: 1.-4. klasse\n",
  };
  const tree = [
    ...Object.keys(files),
    "src/microbit/lys/lesson.yml",
    "src/sponsorer/course.yml",
    "src/sponsorer/logo.png",
  ].map((path) => ({ path }));

  let getTree: jest.Mock;
  const setup = () => {
    getTree = jest.fn().mockResolvedValue({ data: { tree } });
    const github = { createClient: () => ({ git: { getTree } }) };
    return new CatalogService(github as never);
  };

  beforeEach(() => {
    process.env.GH_LESSON_REPO_OWNER = "kodeklubben";
    process.env.GH_LESSON_REPO = "oppgaver";
    global.fetch = jest.fn(async (url: string) => {
      const path = String(url).replace(
        "https://raw.githubusercontent.com/kodeklubben/oppgaver/HEAD/",
        "",
      );
      return path in files
        ? ({ ok: true, text: async () => files[path] } as Response)
        : ({ ok: false, status: 404 } as Response);
    }) as never;
  });
  afterAll(() => {
    process.env = env;
  });

  it("offers the courses one can write in, with their titles, and the repo's tags", async () => {
    const catalog = await setup().catalog("token");
    // Not Codecademy (an external link) and not sponsorer (no index.md); ScratchJr has no lessons
    // yet, but is a course one can write the first one in.
    expect(catalog?.courses).toEqual([
      { value: "microbit", text: "Micro:bit" },
      { value: "scratchjr", text: "ScratchJr" },
    ]);
    expect(catalog?.topic).toEqual([
      { value: "app", name: "App" },
      { value: "web", name: "Nettside" },
    ]);
    expect(catalog?.grade).toEqual([
      { value: "primary", name: "1.-4. klasse" },
      { value: "junior", name: "junior" },
    ]);
  });

  it("reads GitHub once an hour, and answers null when it cannot (the editor's lists apply)", async () => {
    const service = setup();
    await service.catalog("token");
    await service.catalog("token");
    expect(getTree).toHaveBeenCalledTimes(1);

    const failing = setup();
    getTree.mockRejectedValue(new Error("rate limited"));
    const warn = jest.spyOn(console, "warn").mockImplementation(() => undefined);
    expect(await failing.catalog("token")).toBeNull();
    expect(await setup().catalog(undefined)).toBeNull();
    warn.mockRestore();
  });
});
