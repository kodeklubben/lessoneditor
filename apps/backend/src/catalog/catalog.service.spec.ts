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

describe("the lessons in the lesson repo, to find and copy from the front page", () => {
  const env = { ...process.env };
  const files: Record<string, string> = {
    "src/microbit/course.yml": "isExternal: false\n",
    "src/microbit/index.md": '---\ntitle: "Micro:bit"\n---\n',
    "src/codestudio/course.yml": "isExternal: false\n",
    "src/codestudio/index.md": "---\ntitle: Code Studio\n---\n",
    "filtertags/keys.yml": "topic:\n  - game\nsubject: []\ngrade: []\n",
    "filtertags/translation_nb.yml": "topic:\n  TAGS:\n    game:\n      NAME: Spill\n",
    "src/microbit/lys/lesson.yml": "level: 2\ntags:\n  topic: [game]\n",
    "src/microbit/lys/lys.md": "---\ntitle: 'Lys og lyd'\nlevel: 2\n---\n# Intro {.intro}\n",
    "src/microbit/lys/lys_nn.md": "---\ntitle: Lys og lyd\n---\n",
    "src/microbit/lys/README.md": "---\ntitle: Lærarveiledning\n---\n",
    "src/microbit/kompass/lesson.yml": "level: 1\n",
    "src/microbit/kompass/kompass_en.md": "---\ntitle: Compass\n---\n",
    "src/codestudio/artist/lesson.yml": "level: 3\n",
    "src/codestudio/artist/artist.md":
      "---\ntitle: Artist\nexternal: 'https://studio.code.org/s/artist'\n---\n",
  };
  const tree = [...Object.keys(files), "src/microbit/lys/lys.png"].map((path) => ({ path }));

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

  it("lists each lesson with its title, level, languages, guide, tags and picture", async () => {
    const lessons = await setup().lessons("token");
    expect(lessons).toEqual([
      {
        course: "microbit",
        courseTitle: "Micro:bit",
        slug: "kompass",
        text: "kompass_en",
        title: "Compass",
        level: 1,
        languages: ["en"],
        teacherGuide: false,
        tags: { topic: [], subject: [], grade: [] },
        image: undefined,
      },
      {
        course: "microbit",
        courseTitle: "Micro:bit",
        slug: "lys",
        text: "lys",
        title: "Lys og lyd",
        level: 2,
        languages: ["nb", "nn"],
        teacherGuide: true,
        tags: { topic: ["game"], subject: [], grade: [] },
        image: "src/microbit/lys/lys.png",
      },
    ]);
  });

  it("leaves out lessons that are only a link to another site", async () => {
    const lessons = await setup().lessons("token");
    expect(lessons?.map((lesson) => lesson.slug)).not.toContain("artist");
  });

  it("reads only the start of each text: the title is in the front matter", async () => {
    await setup().lessons("token");
    const ranged = (global.fetch as jest.Mock).mock.calls.filter(
      ([, init]) => init?.headers?.Range,
    );
    expect(ranged.length).toBeGreaterThan(0);
    expect(ranged.every(([url]) => String(url).endsWith(".md"))).toBe(true);
  });

  it("shares one read between callers, and answers an old list at once while reading a new", async () => {
    const service = setup();
    const [a, b] = await Promise.all([service.lessons("token"), service.lessons("token")]);
    expect(a).toBe(b);
    expect(getTree).toHaveBeenCalledTimes(2); // the catalog's tree and the lessons' tree

    // An hour later: the old list comes back at once, and one new read starts behind it.
    jest.spyOn(Date, "now").mockReturnValue(Date.now() + 61 * 60 * 1000);
    const stale = await service.lessons("token");
    expect(stale).toBe(a);
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(getTree.mock.calls.length).toBeGreaterThan(2);
    jest.restoreAllMocks();
  });

  it("answers null without a token and nothing read yet", async () => {
    expect(await setup().lessons(undefined)).toBeNull();
  });
});
