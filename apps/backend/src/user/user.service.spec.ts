import { UserService } from "./user.service";

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
      undefined,
      undefined,
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
