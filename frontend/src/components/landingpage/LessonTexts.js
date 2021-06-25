import "./landingpage.scss";
import React from "react";
import LessonCard from "./LessonCard";

import { Card } from "semantic-ui-react";

const LessonTexts = ({ lessonId, lessonList, lessonTitle }) => {
  let languages = [];
  let allLanguages = ["nb", "nn", "en", "is"];

  if (
    Object.keys(lessonList).length !== 0 &&
    lessonList.constructor !== Object
  ) {
    lessonList.forEach((element) => {
      if (element.filename.slice(-2) !== "md") {
        return;
      }
      if (element.filename.slice(0, 6) !== "README") {
        switch (element.filename.slice(-6, -3)) {
          case "_nn":
            if (!languages.includes("nn")) {
              languages.push("nn");
            }
            break;
          case "_en":
            if (!languages.includes("en")) {
              languages.push("en");
            }
            break;
          case "_is":
            if (!languages.includes("is")) {
              languages.push("is");
            }
            break;
          default:
            if (!languages.includes("nb")) {
              languages.push("nb");
            }
            break;
        }
      }
    });
  }

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
