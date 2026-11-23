import { parseLessonMarkdown } from "@lessoneditor/contracts";
import { copyForTranslation, copySourceLanguage } from "./copyForTranslation";

const bokmal = [
  "---",
  "title: Skritteller",
  "author: ''",
  "authorList:",
  "  - Ada",
  "language: nb",
  "level: 2",
  "translator: ''",
  "translatorList: []",
  "---",
  "# Introduksjon {.intro}",
  "",
  "![Bilde](skritt.png)",
  "",
  "```microbit",
  "basic.showNumber(0)",
  "```",
  "",
].join("\n");

describe("a new language starts as a copy (V6)", () => {
  it("copies the whole text, keeps the authors and makes the copier the translator", () => {
    const { data, body } = parseLessonMarkdown<Record<string, unknown>>(
      copyForTranslation(bokmal, "en", "Bo"),
    );
    expect(body).toBe(parseLessonMarkdown(bokmal).body);
    expect(data).toMatchObject({
      title: "Skritteller",
      authorList: ["Ada"],
      language: "en",
      translatorList: ["Bo"],
      level: 2,
    });
  });

  it("copies from bokmål when the lesson has it, otherwise from its first text", () => {
    expect(copySourceLanguage([{ value: "nn" }, { value: "nb" }])).toBe("nb");
    expect(copySourceLanguage([{ value: "nn" }, { value: "en" }])).toBe("nn");
    expect(copySourceLanguage([])).toBeUndefined();
  });
});
