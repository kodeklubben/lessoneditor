import {
  LANGUAGEOPTIONS,
  compareLanguages,
  languageOption,
} from "../components/frontpage/settings/newLessonOptions";
import {
  lessonGuideDefaultText,
  teacherGuideDefaultText,
} from "../components/landingpage/settingsFiles/defaultTexts";
import { filenameParser } from "./filename-parser";

describe("languages", () => {
  it("uses se for Northern Sami and still understands old sam files", () => {
    expect(LANGUAGEOPTIONS.map((option) => option.value)).toContain("se");
    expect(LANGUAGEOPTIONS.map((option) => option.value)).not.toContain("sam");
    expect(languageOption("sam").value).toBe("se");
    expect(filenameParser("hei_sam.md").languageName).toBe("Nordsamisk");
  });

  it("has a lesson and teacher template for every language in the list", () => {
    for (const { value } of LANGUAGEOPTIONS) {
      expect(lessonGuideDefaultText[value]).toEqual(expect.any(String));
      expect(teacherGuideDefaultText[value]).toEqual(expect.any(String));
    }
  });

  it("does not crash on an unknown language code", () => {
    expect(filenameParser("hei_xx.md").languageName).toBe("xx");
  });

  it("lists languages in the order of the language menu", () => {
    expect(["fr", "en", "se", "nb", "is", "nn"].sort(compareLanguages)).toEqual([
      "nb",
      "nn",
      "se",
      "en",
      "is",
      "fr",
    ]);
    expect(["sam", "nb"].sort(compareLanguages)).toEqual(["nb", "sam"]);
  });

  it("does not indent the subject line of a new teacher guide", () => {
    for (const text of Object.values(teacherGuideDefaultText))
      expect(text).not.toMatch(/^ \*\*Fag/m);
    expect(teacherGuideDefaultText.nb).toMatch(/^\*\*Fag\*\*: /m);
  });
});
