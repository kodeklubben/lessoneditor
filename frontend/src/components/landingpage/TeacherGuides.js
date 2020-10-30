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
      switch (
        element.filename.slice(0, 6) === "README"
          ? element.filename.slice(-6, -3)
          : ""
      ) {
        case "nn":
          if (!languages.includes("_nn")) {
            languages.push("nn");
          }
          break;
        case "en":
          if (!languages.includes("_en")) {
            languages.push("en");
          }
          break;
        case "is":
          if (!languages.includes("_is")) {
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
