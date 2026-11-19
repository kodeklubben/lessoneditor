import { publicMember } from "./lesson.controller";
import { isLessonOwner } from "./lesson.entity";
import { LessonService, uniqueFilename } from "./lesson.service";

describe("lesson submission state", () => {
  const lesson = { lessonId: 7, files: [] };
  const repository = { findOne: jest.fn(), update: jest.fn() };
  const github = { submitLesson: jest.fn() };
  const service = new LessonService(
    repository as never,
    undefined,
    undefined,
    github as never,
    undefined,
  );

  beforeEach(() => {
    jest.resetAllMocks();
    repository.findOne.mockResolvedValue(lesson);
  });

  it("keeps a lesson unsubmitted when GitHub rejects or submission is disabled", async () => {
    github.submitLesson.mockRejectedValue(new Error("Submission failed"));
    await expect(
      service.submitLesson(undefined, "test-token", 7, { message: "test" }),
    ).rejects.toThrow("Submission failed");
    expect(repository.update).not.toHaveBeenCalled();
  });

  it("updates only submission status after success, without resaving transformed files", async () => {
    github.submitLesson.mockResolvedValue(undefined);
    await service.submitLesson(undefined, "test-token", 7, { message: "test" });
    expect(repository.update).toHaveBeenCalledWith(7, {
      submitted: true,
      submitted_at: expect.any(Date),
    });
  });
});

describe("lesson members", () => {
  it("does not expose e-mail addresses to other members", () => {
    const member = publicMember({
      userId: 1,
      username: "ada",
      name: "Ada",
      photo: "https://avatars.example/1",
      email: "ada@example.invalid",
      lessons: [],
    } as never);
    expect(member).toEqual({
      userId: 1,
      username: "ada",
      name: "Ada",
      photo: "https://avatars.example/1",
    });
  });
});

describe("lesson ownership", () => {
  it("follows the user id, not a username that can be renamed and taken over", () => {
    const lesson = { created_by: "ada", created_by_id: 1 };
    expect(isLessonOwner(lesson, { userId: 1, username: "ada-renamed" })).toBe(true);
    expect(isLessonOwner(lesson, { userId: 2, username: "ada" })).toBe(false);
  });

  it("falls back to the username only for rows without an id", () => {
    const lesson = { created_by: "ada", created_by_id: null };
    expect(isLessonOwner(lesson, { userId: 2, username: "ada" })).toBe(true);
    expect(isLessonOwner(lesson, { userId: 2, username: "" })).toBe(false);
  });
});

describe("file names", () => {
  it("keeps a free name and numbers a taken one", () => {
    expect(uniqueFilename("bilde", ["hei"])).toBe("bilde");
    expect(uniqueFilename("bilde", ["bilde", "bilde-2"])).toBe("bilde-3");
  });
});
