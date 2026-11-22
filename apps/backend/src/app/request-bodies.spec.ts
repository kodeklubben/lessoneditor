import { ArgumentMetadata, BadRequestException, ValidationPipe } from "@nestjs/common";
import { NewFileBody, NewLessonBody, ShareLessonBody, SubmitLessonBody } from "./request-bodies";
import { lessonYaml } from "../lesson/lesson.controller";

// The same pipe as main.ts.
const pipe = new ValidationPipe({ whitelist: true, transform: true });
const check = (metatype: ArgumentMetadata["metatype"], value: unknown) =>
  pipe.transform(value, { type: "body", metatype });

describe("request bodies", () => {
  it("accept a valid new lesson and drop unknown fields", async () => {
    const body = await check(NewLessonBody, {
      lessonSlug: "hei-verden",
      lessonTitle: "Hei verden",
      courseSlug: "uten_datamaskin",
      courseTitle: "Uten datamaskin",
      language: "nn",
      created_by_id: 99,
    });
    expect(body).toBeInstanceOf(NewLessonBody);
    expect(body).not.toHaveProperty("created_by_id");
  });

  it("refuse slugs that are not paths and fields of the wrong type", async () => {
    await expect(
      check(NewLessonBody, {
        lessonSlug: "../x",
        lessonTitle: "X",
        courseSlug: "python",
        courseTitle: "Python",
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      check(NewFileBody, { filename: "a/b", ext: ".md", content: "" }),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      check(NewFileBody, { filename: "a", ext: ".exe", content: "" }),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      check(NewFileBody, { filename: "a", ext: ".md", content: { x: 1 } }),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(check(ShareLessonBody, { invitationToUserId: "1 OR 1=1" })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    await expect(check(SubmitLessonBody, { message: 42 })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it("keep only the inviter the server sets: invitationByUserId is dropped", async () => {
    const body = await check(ShareLessonBody, {
      invitationToUserId: "12",
      invitationByUserId: "1",
    });
    expect(body).toEqual({ invitationToUserId: "12" });
  });
});

describe("lesson.yml", () => {
  it("keeps the known fields", () => {
    expect(
      lessonYaml({ level: 2, license: "CC BY-SA 4.0", tags: { topic: ["app"] }, extra: 1 }),
    ).toEqual({
      level: 2,
      license: "CC BY-SA 4.0",
      tags: { topic: ["app"], subject: [], grade: [] },
    });
  });

  it("refuses other shapes", () => {
    expect(() => lessonYaml("level: 1")).toThrow(BadRequestException);
    expect(() => lessonYaml({ level: "1", license: "x", tags: {} })).toThrow(BadRequestException);
    expect(() => lessonYaml({ level: 1, license: "x", tags: { topic: [1] } })).toThrow(
      BadRequestException,
    );
  });
});
