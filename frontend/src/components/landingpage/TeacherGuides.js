import "./landingpage.scss";
import React from "react";

import LessonCard from "./LessonCard";

const TeacherGuides = ({ thumbUrl, lessonId, lessonList }) => {
  let languages = [];
  let allLanguages = ["nb", "nn", "en", "is"];

  if (
    Object.keys(lessonList).length !== 0 &&
    lessonList.constructor !== Object
  ) {
    lessonList.forEach((element) => {
      switch (
        element.filename.slice(-2) === "md" &&
        element.filename.slice(6).toLowerCase() === "readme" &&
        element.filename.slice(-5, -3)
      ) {
        case "nn":
          if (!languages.includes("nn")) {
            languages.push("nn");
          }
          break;
        case "en":
          if (!languages.includes("en")) {
            languages.push("en");
          }
          break;
        case "is":
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
                  language={element}
                  hasContent={languages.includes(element)}
                  thumbUrl={thumbUrl}
                  lessonId={lessonId}
                  lessonTitle={"readme"}
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
