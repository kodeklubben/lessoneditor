import { publicMember } from "./lesson.controller";
import { isLessonOwner } from "./lesson.entity";
import { LessonService, uniqueFilename } from "./lesson.service";
import { deletionBlocker, splitFilename } from "../../../../libs/contracts/src/lib/files";

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

describe("deleting files (K15)", () => {
  const files = [
    { filename: "lesson", ext: ".yml" },
    { filename: "preview", ext: ".png" },
    { filename: "hei", ext: ".md" },
    { filename: "README", ext: ".md" },
    { filename: "bilde", ext: ".png" },
  ];

  it("keeps lesson.yml, preview.png and the last lesson text", () => {
    expect(deletionBlocker(files[0], files)).toMatch(/lesson.yml/);
    expect(deletionBlocker(files[1], files)).toMatch(/Miniatyrbildet/);
    expect(deletionBlocker(files[2], files)).toMatch(/siste oppgaveteksten/);
  });

  it("allows teacher guides, images and a lesson text that is not the last", () => {
    expect(deletionBlocker(files[3], files)).toBeNull();
    expect(deletionBlocker(files[4], files)).toBeNull();
    const twoTexts = [...files, { filename: "hei_en", ext: ".md" }];
    expect(deletionBlocker(files[2], twoTexts)).toBeNull();
  });

  it("splits a file name at the last dot", () => {
    expect(splitFilename("hei_en.md")).toEqual({ filename: "hei_en", ext: ".md" });
    expect(splitFilename("bilde.v2.png")).toEqual({ filename: "bilde.v2", ext: ".png" });
  });
});

describe("thumbnails (K14)", () => {
  const setup = () => {
    const lesson = { lessonId: 3, files: [{ filename: "hei", ext: ".md" }] };
    const repository = { findOne: jest.fn().mockResolvedValue(lesson), save: jest.fn() };
    const thumbs = { getThumb: jest.fn().mockResolvedValue(new Uint8Array([137, 80]).buffer) };
    const service = new LessonService(
      repository as never,
      undefined,
      undefined,
      undefined,
      thumbs as never,
    );
    return { lesson, thumbs, service };
  };

  it("creates preview.png when an older lesson has none", async () => {
    const { lesson, service } = setup();
    await expect(
      service.updateThumbnail(3, "hei", { user: { username: "ada" } } as never),
    ).resolves.toBe(true);
    const preview = lesson.files.find((file) => file.filename === "preview") as unknown as {
      ext: string;
      content: Buffer;
      created_by: string;
    };
    expect(preview.ext).toBe(".png");
    expect(preview.content[0]).toBe(137);
    expect(preview.created_by).toBe("ada");
  });

  it("refuses a file that is not a text of the lesson", async () => {
    const { thumbs, service } = setup();
    await expect(service.updateThumbnail(3, "ukjent", {} as never)).rejects.toThrow(
      "File does not exist",
    );
    expect(thumbs.getThumb).not.toHaveBeenCalled();
  });
});
