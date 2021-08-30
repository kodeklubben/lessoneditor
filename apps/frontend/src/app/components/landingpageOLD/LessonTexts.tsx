import "./landingpage.scss";
import LessonCard from "./LessonCard";

import { Card } from "semantic-ui-react";
import { FC } from "react";
import { getLanguagesFromLessonlist } from "./utils/get-languages-from-lessonlist";

const LessonTexts: FC<any> = ({ lessonId, lessonList, lessonTitle }) => {
  const languages = getLanguagesFromLessonlist(lessonList);
  const allLanguages = ["nb", "nn", "en", "is"];

  return (
    <>
      <Card.Group centered>
        {allLanguages.map((element, index) => {
          return (
            <LessonCard
              key={element + index}
              title={"Oppgavetekst"}
              language={element}
              hasContent={languages.includes(element)}
              lessonId={lessonId}
              lessonTitle={lessonTitle}
            />
          );
        })}
      </Card.Group>
    </>
  );
};

export default LessonTexts;
