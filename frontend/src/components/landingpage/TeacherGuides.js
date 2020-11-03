import "./landingpage.scss";
import React from "react";

import LessonCard from "./LessonCard";

const TeacherGuides = ({ lessonId, lessonList }) => {
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
      if (element.filename.slice(0, 6) === "README") {
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
            if (
              !languages.includes("nb") &&
              element.filename.slice(0, 6) === "README"
            ) {
              languages.push("nb");
            }
            break;
        }
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
                  title={"Lærerveiledning"}
                  language={element}
                  hasContent={languages.includes(element)}
                  lessonId={lessonId}
                  lessonTitle={"README"}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default TeacherGuides;
