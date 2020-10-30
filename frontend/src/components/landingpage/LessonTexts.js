import "./landingpage.scss";
import React from "react";

import LessonCard from "./LessonCard";
// import { LessonContext } from "contexts/LessonContext";

const LessonTexts = ({ lessonId, lessonList }) => {
  // const lesson = useContext(LessonContext);
  // const { lessonList } = lesson;

  let languages = [];
  let allLanguages = ["nb", "nn", "en", "is"];
  let lessonTitle = "";

  if (
    Object.keys(lessonList).length !== 0 &&
    lessonList.constructor !== Object
  ) {
    lessonList.forEach((element) => {
      if (element.filename.slice(-2) !== "md") {
        return;
      }
      switch (
        element.filename.slice(0, 6) !== "README"
          ? element.filename.slice(-6, -3)
          : ""
      ) {
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
          lessonTitle = element.filename.slice(0, -3);
          if (!languages.includes("nb")) {
            languages.push("nb");
          }
          break;
      }
    });
  }

  return (
    <>
      <div style={{ marginBottom: "5em" }}>
        <div style={{ display: "flex" }}>
          {allLanguages.map((element, index) => {
            return (
              <div key={element + index}>
                <LessonCard
                  title={"Oppgavetekst"}
                  language={element}
                  hasContent={languages.includes(element)}
                  lessonId={lessonId}
                  lessonTitle={lessonTitle}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default LessonTexts;
