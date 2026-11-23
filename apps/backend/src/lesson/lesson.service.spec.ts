import { publicMember } from "./lesson.controller";
import { isLessonOwner } from "./lesson.entity";
import { contentVersion, LessonService, uniqueFilename } from "./lesson.service";
import { deletionBlocker, splitFilename } from "../../../../libs/contracts/src/lib/files";

describe("lesson submission state", () => {
  const lesson = { lessonId: 7, files: [] };
  const repository = { findOne: jest.fn(), update: jest.fn() };
  const github = { submitLesson: jest.fn() };
  const service = new LessonService(
    repository as never,
    undefined as never,
    undefined as never,
    github as never,
    undefined as never,
  );

  beforeEach(() => {
    jest.resetAllMocks();
    repository.findOne.mockResolvedValue(lesson);
  });

  it("keeps a lesson unsubmitted when GitHub rejects or submission is disabled", async () => {
    github.submitLesson.mockRejectedValue(new Error("Submission failed"));
    await expect(
      service.submitLesson(undefined as never, "test-token", 7, { message: "test" }),
    ).rejects.toThrow("Submission failed");
    expect(repository.update).not.toHaveBeenCalled();
  });

  it("updates only submission status after success, without resaving transformed files", async () => {
    github.submitLesson.mockResolvedValue(undefined);
    await service.submitLesson(undefined as never, "test-token", 7, { message: "test" });
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
  type Row = {
    fileId: number;
    filename: string;
    ext: string;
    upstream_sha?: string | null;
    content?: Buffer;
  };
  // Answers findOne like the database, for the files of lesson 3.
  const setup = (rows: Row[]) => {
    const files = {
      findOne: jest.fn(async ({ where }: { where: { filename: string; ext: string } }) => {
        return rows.find((row) => row.filename === where.filename && row.ext === where.ext) ?? null;
      }),
      find: jest.fn(async () => rows.filter((row) => row.ext === ".md")),
      update: jest.fn(),
      insert: jest.fn(),
    };
    const lessons = { save: jest.fn(), findOne: jest.fn() };
    const thumbs = { getThumb: jest.fn().mockResolvedValue(new Uint8Array([137, 80]).buffer) };
    const service = new LessonService(
      lessons as never,
      undefined as never,
      files as never,
      undefined as never,
      thumbs as never,
    );
    return { files, lessons, thumbs, service };
  };
  const text = { fileId: 1, filename: "hei", ext: ".md" };

  it("writes only the text's and the preview's rows, never the lesson with all its files", async () => {
    const { files, lessons, service } = setup([
      text,
      { fileId: 2, filename: "preview", ext: ".png" },
    ]);
    await expect(service.updateThumbnail(3, "hei", {} as never)).resolves.toBe(true);
    expect(files.update).toHaveBeenCalledWith(1, { thumbnail: expect.any(Buffer) });
    expect(files.update).toHaveBeenCalledWith(2, { content: expect.any(Buffer) });
    expect(files.update.mock.calls[1][1].content[0]).toBe(137);
    expect(lessons.save).not.toHaveBeenCalled();
    expect(lessons.findOne).not.toHaveBeenCalled();
  });

  it("creates preview.png when an older lesson has none", async () => {
    const { files, service } = setup([text]);
    await service.updateThumbnail(3, "hei", { user: { username: "ada" } } as never);
    expect(files.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        filename: "preview",
        ext: ".png",
        created_by: "ada",
        lesson: { lessonId: 3 },
      }),
    );
  });

  it("keeps a copy's own preview.png from the repo, and still gives the text its picture", async () => {
    const preview = { fileId: 2, filename: "preview", ext: ".png", upstream_sha: "abc" };
    const { files, service } = setup([text, preview]);
    await expect(service.updateThumbnail(3, "hei", {} as never)).resolves.toBe(true);
    expect(files.update).toHaveBeenCalledTimes(1);
    expect(files.update).toHaveBeenCalledWith(1, { thumbnail: expect.any(Buffer) });
  });

  it("gives each text its own picture; only the main text's is the lesson's preview (1, N5)", async () => {
    const rows = [
      text,
      { fileId: 3, filename: "hei_nn", ext: ".md" },
      { fileId: 4, filename: "README", ext: ".md" },
      { fileId: 2, filename: "preview", ext: ".png" },
    ];
    const { files, service } = setup(rows);
    await service.updateThumbnail(3, "README", {} as never);
    await service.updateThumbnail(3, "hei_nn", {} as never);
    expect(files.update.mock.calls).toEqual([
      [4, { thumbnail: expect.any(Buffer) }],
      [3, { thumbnail: expect.any(Buffer) }],
    ]);
    await service.updateThumbnail(3, "hei", {} as never);
    expect(files.update).toHaveBeenCalledWith(2, { content: expect.any(Buffer) });
  });

  it("photographs a lesson without a preview yet, and leaves one that has it alone (9f)", async () => {
    const placeholder = { fileId: 2, filename: "preview", ext: ".png", content: Buffer.from(" ") };
    expect(await setup([text, placeholder]).service.textForMissingPreview(3)).toBe("hei");
    expect(await setup([text]).service.textForMissingPreview(3)).toBe("hei");
    const real = { ...placeholder, content: Buffer.from("png data") };
    expect(await setup([text, real]).service.textForMissingPreview(3)).toBeUndefined();
    const fromRepo = { ...placeholder, upstream_sha: "abc" };
    expect(await setup([text, fromRepo]).service.textForMissingPreview(3)).toBeUndefined();
  });

  it("refuses a file that is not a text of the lesson", async () => {
    const { thumbs, service } = setup([text]);
    await expect(service.updateThumbnail(3, "ukjent", {} as never)).rejects.toThrow(
      "File does not exist",
    );
    expect(thumbs.getThumb).not.toHaveBeenCalled();
  });
});

describe("a text saved in two places (two tabs, two co-authors)", () => {
  const setup = (affected = 1) => {
    const file = { fileId: 5, filename: "hei", ext: ".md", content: Buffer.from("felles") };
    const files = {
      findOne: jest.fn().mockResolvedValue(file),
      update: jest.fn().mockResolvedValue({ affected }),
    };
    const lessons = { update: jest.fn() };
    const users = { findOne: jest.fn().mockResolvedValue({ userId: 1, username: "ada" }) };
    const service = new LessonService(
      lessons as never,
      users as never,
      files as never,
      undefined as never,
      undefined as never,
    );
    return { service, files, file };
  };

  it("refuses a save made to an older version, instead of replacing the newer text", async () => {
    const { service, files } = setup();
    const old = contentVersion(Buffer.from("noe annet"));
    await expect(service.updateLessonFile(3, "hei", 1, "min tekst", old)).rejects.toMatchObject({
      status: 409,
    });
    expect(files.update).not.toHaveBeenCalled();
  });

  it("saves over the version it was made to, and only while the row still holds it", async () => {
    const { service, files, file } = setup();
    await service.updateLessonFile(3, "hei", 1, "min tekst", contentVersion(file.content));
    expect(files.update).toHaveBeenCalledWith(
      { fileId: 5, content: Buffer.from("felles") },
      expect.objectContaining({ content: Buffer.from("min tekst") }),
    );
  });

  it("refuses when the other save got in between the check and the write", async () => {
    const { service, file } = setup(0);
    await expect(
      service.updateLessonFile(3, "hei", 1, "min tekst", contentVersion(file.content)),
    ).rejects.toMatchObject({ status: 409 });
  });
});

describe("saving a text", () => {
  it("updates only that file's row and the lesson's time", async () => {
    const file = { fileId: 5, filename: "hei", ext: ".md", content: Buffer.from("gammel") };
    const files = {
      findOne: jest.fn().mockResolvedValue(file),
      update: jest.fn().mockResolvedValue({ affected: 1 }),
    };
    const lessons = { save: jest.fn(), update: jest.fn() };
    const users = { findOne: jest.fn().mockResolvedValue({ userId: 1, username: "ada" }) };
    const service = new LessonService(
      lessons as never,
      users as never,
      files as never,
      undefined as never,
      undefined as never,
    );
    const saved = await service.updateLessonFile(3, "hei", 1, "ny");
    expect(files.update).toHaveBeenCalledWith(
      { fileId: 5 },
      {
        content: Buffer.from("ny"),
        updated_by: "ada",
      },
    );
    expect(lessons.update).toHaveBeenCalledWith(3, { updated_at: expect.any(Date) });
    expect(lessons.save).not.toHaveBeenCalled();
    expect(saved.content.toString()).toBe("ny");
  });
});

describe("finding a file by name", () => {
  // As in kodeklubben/oppgaver: the cover image has the lesson text's name.
  const files = [
    { filename: "asteroids", ext: ".png", content: Buffer.from("png") },
    { filename: "asteroids", ext: ".md", content: Buffer.from("text") },
    { filename: "lesson", ext: ".yml", content: Buffer.from("{}") },
  ];
  // Answers like the database: the files of lesson 1 whose name is one of those asked for.
  const fileRepository = {
    find: jest.fn(),
  };
  const service = new LessonService(
    undefined as never,
    undefined as never,
    fileRepository as never,
    undefined as never,
    undefined as never,
  );

  beforeEach(() =>
    fileRepository.find.mockImplementation(
      async ({ where }: { where: { lesson: { lessonId: number }; filename: string }[] }) =>
        files.filter((file) =>
          where.some((w) => w.lesson.lessonId === 1 && w.filename === file.filename),
        ),
    ),
  );

  it("finds the image by its full name and the text by the name alone", async () => {
    expect((await service.getLessonFile(1, "asteroids.png")).ext).toBe(".png");
    expect((await service.getLessonFile(1, "asteroids")).ext).toBe(".md");
    expect((await service.getLessonFile(1, "lesson")).ext).toBe(".yml");
    await expect(service.getLessonFile(1, "asteroids.gif")).rejects.toThrow("File does not exist");
  });
});
