import { newLessonFiles, UserService } from "./user.service";

describe("a new lesson's folder (P0-2)", () => {
  const lesson = {
    lessonSlug: "asteroids",
    lessonTitle: "Asteroids",
    courseSlug: "scratch",
    courseTitle: "Scratch",
  };
  const setup = (own: unknown, published: boolean | Error) => {
    const lessonRepository = {
      findOne: jest.fn().mockResolvedValue(own),
      manager: { transaction: jest.fn().mockResolvedValue(9) },
    };
    const userRepository = { findOne: jest.fn().mockResolvedValue({ userId: 1, username: "ada" }) };
    const github = {
      lessonFolderExists: jest.fn(async () => {
        if (published instanceof Error) throw published;
        return published;
      }),
    };
    const service = new UserService(
      lessonRepository as never,
      userRepository as never,
      github as never,
    );
    return { service, lessonRepository, github };
  };

  it("is refused when a published lesson has it", async () => {
    const { service, lessonRepository, github } = setup(null, true);
    await expect(service.addUserLesson(1, lesson, "token")).rejects.toMatchObject({
      status: 409,
      message: expect.stringContaining("src/scratch/asteroids"),
    });
    expect(github.lessonFolderExists).toHaveBeenCalledWith("token", "src/scratch/asteroids");
    expect(lessonRepository.manager.transaction).not.toHaveBeenCalled();
  });

  it("is refused when the user already has a lesson with that name in the course", async () => {
    const { service, github } = setup({ lessonTitle: "Asteroids" }, false);
    await expect(service.addUserLesson(1, lesson, "token")).rejects.toMatchObject({ status: 409 });
    expect(github.lessonFolderExists).not.toHaveBeenCalled();
  });

  it("is created when free, or when GitHub cannot answer (checked again on submission)", async () => {
    const warn = jest.spyOn(console, "warn").mockImplementation(() => undefined);
    await expect(setup(null, false).service.addUserLesson(1, lesson, "token")).resolves.toBe(9);
    await expect(
      setup(null, new Error("rate limited")).service.addUserLesson(1, lesson, "token"),
    ).resolves.toBe(9);
    warn.mockRestore();
  });
});

describe("creating a lesson", () => {
  const lesson = {
    lessonSlug: "hei",
    lessonTitle: "Hei",
    courseSlug: "python",
    courseTitle: "Python",
  };

  it("names the text after the slug and language, defaulting to bokmål", async () => {
    const saved: { entity: { name: string }; value: unknown }[] = [];
    const add = jest.fn();
    const manager = {
      save: jest.fn(async (entity: { name: string }, value: unknown) => {
        saved.push({ entity, value });
        return entity.name === "Lesson" ? { ...(value as object), lessonId: 9 } : value;
      }),
      createQueryBuilder: () => ({ relation: () => ({ of: () => ({ add }) }) }),
    };
    const lessonRepository = {
      findOne: jest.fn().mockResolvedValue(null),
      manager: {
        transaction: jest.fn(async (work: (m: typeof manager) => unknown) => work(manager)),
      },
    };
    const userRepository = {
      findOne: jest.fn().mockResolvedValue({ userId: 1, username: "ada", name: "Ada" }),
    };
    const service = new UserService(
      lessonRepository as never,
      userRepository as never,
      undefined as never,
    );

    await expect(service.addUserLesson(1, lesson)).resolves.toBe(9);
    const files = saved.find(({ entity }) => entity.name === "FileStore")?.value as {
      filename: string;
      ext: string;
    }[];
    expect(files.map(({ filename, ext }) => filename + ext)).toEqual([
      "hei.md",
      "lesson.yml",
      "image_rT34Yx.png",
      "preview.png",
    ]);
    expect(add).toHaveBeenCalledWith(9);
    expect(lessonRepository.manager.transaction).toHaveBeenCalledTimes(1);
  });

  it("uses <slug>_<language> for other languages and puts the language in the front matter", () => {
    const [text] = newLessonFiles({ ...lesson, language: "en" }, { name: "", username: "ada" });
    expect(text.filename).toBe("hei_en");
    expect(text.content.toString()).toContain("language: en");
    expect(text.content.toString()).toContain("- ada");
  });
});

describe("deleting a lesson", () => {
  function setup(lesson: object | null) {
    const steps: string[] = [];
    const manager = {
      query: jest.fn(async () => steps.push("members")),
      delete: jest.fn(async (entity: { name: string }) => steps.push(entity.name)),
    };
    const lessonRepository = {
      findOne: jest.fn().mockResolvedValue(lesson),
      manager: {
        transaction: jest.fn(async (work: (m: typeof manager) => Promise<void>) => {
          steps.push("begin");
          await work(manager);
          steps.push("commit");
        }),
      },
    };
    const userRepository = {
      findOne: jest.fn().mockResolvedValue({ userId: 1, username: "ada", lessons: [] }),
    };
    const service = new UserService(
      lessonRepository as never,
      userRepository as never,
      undefined as never,
    );
    return { service, steps, lessonRepository };
  }

  it("removes every member, the files and the lesson in one transaction", async () => {
    const { service, steps } = setup({
      lessonId: 5,
      created_by: "ada",
      created_by_id: 1,
      files: [],
    });
    await service.deleteUserLesson(1, 5);
    expect(steps).toEqual(["begin", "members", "FileStore", "Lesson", "commit"]);
  });

  it("refuses others than the creator", async () => {
    const { service, lessonRepository } = setup({
      lessonId: 5,
      created_by: "bo",
      created_by_id: 2,
      files: [],
    });
    await expect(service.deleteUserLesson(1, 5)).rejects.toMatchObject({ status: 403 });
    expect(lessonRepository.manager.transaction).not.toHaveBeenCalled();
  });
});
