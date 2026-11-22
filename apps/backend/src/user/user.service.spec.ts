import { newLessonFiles, UserService } from "./user.service";

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
      manager: { transaction: jest.fn(async (work: (m: typeof manager) => unknown) => work(manager)) },
    };
    const userRepository = {
      findOne: jest.fn().mockResolvedValue({ userId: 1, username: "ada", name: "Ada" }),
    };
    const service = new UserService(lessonRepository as never, userRepository as never);

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
    const service = new UserService(lessonRepository as never, userRepository as never);
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
