import "./landingpage.scss";
import React, { useContext } from "react";
import yaml from "js-yaml";

import { LessonContext } from "contexts/LessonContext";

const AllFiles = ({ lessonId, thumbUrl }) => {
  const lesson = useContext(LessonContext);
  const { lessonList, test, ymlFiles } = lesson;

  console.log("lessonlist : " + JSON.stringify(lessonList));
  console.log(yaml.safeLoad("/api/display/" + lessonId + "/lesson.yml"));
  const test2 = async (lessonId) => {
    console.log(await test(lessonId));
  };
  console.log(test2(lessonId));
  console.log(ymlFiles);

  return (
    <>
      <div style={{ marginBottom: "5em" }}>
        <div style={{ marginLeft: "5em" }}>
          {lessonList.map((element, index) => {
            console.log("element : " + JSON.stringify(element));
            return <h2>{element.filename}</h2>;
          })}
        </div>
      </div>
    </>
  );
};

export default AllFiles;
