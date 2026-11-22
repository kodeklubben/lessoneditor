import { invalidLessonFields, isCourseSlug, isLessonSlug } from "@lessoneditor/contracts";

describe("lesson slugs", () => {
  it("accepts what the editor produces with slugify", () => {
    expect(isLessonSlug("hei-verden-2")).toBe(true);
    expect(isCourseSlug("uten_datamaskin")).toBe(true);
  });

  it.each(["../oppgaver", "a/b", "Hei", "", "-a", "a--b", "a b", "a".repeat(101)])(
    "refuses %p as a lesson slug",
    (slug) => expect(isLessonSlug(slug)).toBe(false),
  );

  it("names every invalid field", () => {
    expect(
      invalidLessonFields({
        lessonSlug: "../x",
        lessonTitle: " ",
        courseSlug: "py/thon",
        language: "nb-NO",
      }),
    ).toEqual(["lessonSlug", "lessonTitle", "courseSlug", "language"]);
    expect(
      invalidLessonFields({
        lessonSlug: "x",
        lessonTitle: "X",
        courseSlug: "python",
        courseTitle: "Python",
        language: "nb",
      }),
    ).toEqual([]);
  });
});
