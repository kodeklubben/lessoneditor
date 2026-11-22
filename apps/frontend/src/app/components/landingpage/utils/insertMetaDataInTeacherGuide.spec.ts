import insertMetaDataInTeacherGuide from "./insertMetaDataInTeacherGuide";
import { teacherGuideDefaultText } from "../settingsFiles/defaultTexts";

describe("teacher guide metadata", () => {
  it("fills every placeholder and leaves none behind", () => {
    const text = insertMetaDataInTeacherGuide(
      { tags: { subject: [], topic: [], grade: [] } },
      "nb",
    );
    expect(teacherGuideDefaultText.nb).toMatch(/\{(subject|topic|grade)\}/);
    expect(text).not.toMatch(/\{(subject|topic|grade)\}/);
  });

  it("inserts unknown keys as they are, also with a $ in them", () => {
    const text = insertMetaDataInTeacherGuide(
      { tags: { subject: ["$&-fag"], topic: [], grade: [] } },
      "nb",
    );
    expect(text).toContain("$&-fag");
  });
});
