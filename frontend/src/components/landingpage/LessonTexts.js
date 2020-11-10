import "./landingpage.scss";
import React, { useContext } from "react";
import { LessonContext } from "contexts/LessonContext";
import LessonCard from "./LessonCard";

const LessonTexts = ({ lessonId, lessonList, setShowSpinner }) => {
  const lesson = useContext(LessonContext);
  const { data } = lesson;

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
    setShowSpinner(false);
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
                  lessonTitle={data.lesson}
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
