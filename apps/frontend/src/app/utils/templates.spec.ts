import { lessonTemplate, teacherGuideTemplate, TEMPLATE_LANGUAGES } from "@lessoneditor/contracts";
import { mdParser } from "./mdParser";
import insertMetaDataInTeacherGuide from "../components/landingpage/utils/insertMetaDataInTeacherGuide";

/** The markup a template is built from: its section classes in order, images and code blocks. */
const shape = (text: string) => ({
  sections: text.match(/\{\.[a-z]+\}/g),
  images: text.match(/\(\.\/[^)]+\)/g),
  fences: text.match(/^```/gm)?.length,
  checklistItems: text.match(/^- \[ \]/gm)?.length,
});

describe("lesson and teacher guide templates", () => {
  it("are translated to nynorsk, English, Icelandic, French and Ukrainian", () => {
    expect(TEMPLATE_LANGUAGES.sort()).toEqual(["en", "fr", "is", "nb", "nn", "ua"]);
  });

  it.each(TEMPLATE_LANGUAGES)(
    "%s has the same sections, image and checklists as bokmål",
    (language) => {
      expect(shape(lessonTemplate(language))).toEqual(shape(lessonTemplate("nb")));
      expect(shape(teacherGuideTemplate(language))).toEqual(shape(teacherGuideTemplate("nb")));
    },
  );

  it.each(TEMPLATE_LANGUAGES)(
    "%s fills in the teacher guide's subject, grade and topic",
    (language) => {
      const guide = insertMetaDataInTeacherGuide(
        { tags: { subject: ["mathematics"], grade: ["primary"], topic: ["game"] } },
        language,
      );
      expect(guide).not.toMatch(/\{(subject|grade|topic)\}/);
    },
  );

  it("starts Northern Sami and unknown languages from bokmål, and reads uk as ua", () => {
    expect(lessonTemplate("se")).toBe(lessonTemplate("nb"));
    expect(teacherGuideTemplate("xx")).toBe(teacherGuideTemplate("nb"));
    expect(lessonTemplate("uk")).toBe(lessonTemplate("ua"));
  });

  it("shows ``` in the hint as code, not as a fence", () => {
    for (const language of TEMPLATE_LANGUAGES) {
      expect(mdParser(lessonTemplate(language))).toContain("<code>```</code>");
    }
  });
});
