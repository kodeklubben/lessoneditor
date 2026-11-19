import { LANGUAGEOPTIONS, languageOption } from "../components/frontpage/settings/newLessonOptions";
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
});
