import "./landingpage.scss";
import LessonCard from "./LessonCard";

import { Card } from "semantic-ui-react";
import { FC } from "react";
import { getLanuagesFromLessonlist } from "./utils/get-lanuages-from-lessonlist";

const TeacherGuides: FC<any> = ({ lessonId, lessonList }) => {
  const languages = getLanuagesFromLessonlist(lessonList);
  let allLanguages = ["nb", "nn", "en", "is"];

  return (
    <>
      <Card.Group centered>
        {allLanguages.map((element, index) => {
          return (
            <LessonCard
              title={"Lærerveiledning"}
              language={element}
              hasContent={languages.includes(element)}
              lessonId={lessonId}
              lessonTitle={"README"}
            />
          );
        })}
      </Card.Group>
    </>
  );
};

export default TeacherGuides;
