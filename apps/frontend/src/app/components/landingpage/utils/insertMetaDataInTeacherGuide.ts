import { GRADE, SUBJECT, TOPIC } from "../../editor/datapanel/settings/landingpage_NO";
import { teacherGuideDefaultText } from "../settingsFiles/defaultTexts";

const labels = (keys: string[] | undefined, names: Record<string, string>) =>
  (keys ?? []).map((key) => names[key] ?? key).join(", ");

/**
 * Fills {subject}, {topic} and {grade} in the teacher guide template. A function as replacement,
 * so a "$" in a label is inserted as it is and not read as a replacement pattern.
 */
const insertMetaDataInTeacherGuide = (
  ymlData: {
    tags: { subject: string[]; topic: string[]; grade: string[] };
  },
  lang: string,
) => {
  const text: string = teacherGuideDefaultText[lang] ?? teacherGuideDefaultText.nb;
  const values: Record<string, string> = {
    subject: labels(ymlData.tags?.subject, SUBJECT as Record<string, string>),
    topic: labels(ymlData.tags?.topic, TOPIC as Record<string, string>),
    grade: labels(ymlData.tags?.grade, GRADE as Record<string, string>),
  };
  return text.replace(/\{(subject|topic|grade)\}/g, (_whole, key: string) => values[key]);
};

export default insertMetaDataInTeacherGuide;
