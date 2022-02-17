import { GRADE, SUBJECT, TOPIC } from "../../editor/datapanel/settings/landingpage_NO";
import { teacherGuideDefaultText } from "../settingsFiles/defaultTexts";

const insertMetaDataInTeacherGuide = (
  ymlData: {
    tags: { subject: string[]; topic: string[]; grade: string[] };
  },
  lang: string
) => {
  const text = teacherGuideDefaultText[lang];
  const subject = ymlData.tags.subject.map((element: string) => {
    //@ts-ignore
    return SUBJECT[element];
  });
  const topic = ymlData.tags.topic.map((element) => {
    //@ts-ignore
    return TOPIC[element];
  });
  const grade = ymlData.tags.grade.map((element) => {
    //@ts-ignore
    return GRADE[element];
  });

  let returnText = text.replace(/{subject}/, subject.join(", "));
  returnText = returnText.replace(/{topic}/, topic.join(", "));
  returnText = returnText.replace(/{grade}/, grade.join(", "));

  return returnText;
};

export default insertMetaDataInTeacherGuide;
