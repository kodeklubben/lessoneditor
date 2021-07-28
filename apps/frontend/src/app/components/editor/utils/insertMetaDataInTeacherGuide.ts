import { GRADE, SUBJECT, TOPIC } from "../datapanel/settings/landingpage_NO";
import laererveiledningMal from "../LaererveiledningMal";

const insertMetaDataInTeacherGuide = (ymlData: { tags: { subject: any[]; topic: any[]; grade: any[]; }; }) => {
  const subject = ymlData.tags.subject.map((element) => {
    // @ts-ignore
    return SUBJECT[element];
  });
  const topic = ymlData.tags.topic.map((element) => {
    // @ts-ignore
    return TOPIC[element];
  });
  const grade = ymlData.tags.grade.map((element) => {
    // @ts-ignore
    return GRADE[element];
  });

  let veiledningWithData = laererveiledningMal.replace(
    /{subject}/,
    subject.join(", ")
  );
  veiledningWithData = veiledningWithData.replace(/{topic}/, topic.join(", "));
  veiledningWithData = veiledningWithData.replace(/{grade}/, grade.join(", "));
  return veiledningWithData;
};

export default insertMetaDataInTeacherGuide;
