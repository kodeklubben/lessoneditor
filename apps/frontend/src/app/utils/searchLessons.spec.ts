import { CatalogLesson } from "@lessoneditor/contracts";
import { searchLessons } from "./searchLessons";

const lesson = (title: string, extra: Partial<CatalogLesson> = {}): CatalogLesson => ({
  course: "scratch",
  courseTitle: "Scratch",
  slug: title.toLowerCase().replace(/\s+/g, "_"),
  text: title.toLowerCase(),
  title,
  level: 1,
  languages: ["nb"],
  teacherGuide: false,
  tags: { topic: [], subject: [], grade: [] },
  ...extra,
});

const lessons = [
  lesson("Flappy Bird", { level: 2, tags: { topic: ["game"], subject: [], grade: [] } }),
  lesson("Asteroids", { level: 4, languages: ["nb", "nn", "ua"] }),
  lesson("Hoppehelt", { tags: { topic: ["game"], subject: [], grade: [] } }),
  lesson("Bli kjent med Python", {
    course: "python",
    courseTitle: "Python",
    languages: ["nb", "en"],
  }),
  lesson("Kompass", { course: "microbit", courseTitle: "micro:bit", level: 1 }),
];
const titles = (found: CatalogLesson[]) => found.map((l) => l.title);

describe("searching the lessons on the front page", () => {
  it("finds every word, in title, course or topic, without regard to case and accents", () => {
    expect(titles(searchLessons(lessons, { query: "PYTHON kjent" }))).toEqual([
      "Bli kjent med Python",
    ]);
    expect(titles(searchLessons(lessons, { query: "spill" }, { game: "Spill" }))).toEqual([
      "Flappy Bird",
      "Hoppehelt",
    ]);
    expect(titles(searchLessons(lessons, { query: "kómpass" }))).toEqual(["Kompass"]);
  });

  it("puts titles that start with the query first", () => {
    expect(titles(searchLessons(lessons, { query: "h" })).slice(0, 1)).toEqual(["Hoppehelt"]);
  });

  it("filters by course, level and language", () => {
    expect(titles(searchLessons(lessons, { query: "", course: "python" }))).toEqual([
      "Bli kjent med Python",
    ]);
    expect(titles(searchLessons(lessons, { query: "", level: 4 }))).toEqual(["Asteroids"]);
    expect(titles(searchLessons(lessons, { query: "", language: "ua" }))).toEqual(["Asteroids"]);
  });

  it("gives everything in the catalogue's order without a query or filter", () => {
    expect(searchLessons(lessons, { query: "  " })).toEqual(lessons);
  });
});
