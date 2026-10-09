import { LessonService } from "./lesson.service";

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
