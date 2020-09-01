import "./landingpage.scss";
import React, { useContext } from "react";

import { LessonContext } from "contexts/LessonContext";

const AllFiles = () => {
  const lesson = useContext(LessonContext);
  const { lessonList } = lesson;

  return (
    <>
      <div style={{ marginBottom: "5em" }}>
        <div style={{ marginLeft: "5em" }}>
          {lessonList.map((element, index) => {
            return <h2>{element.filename}</h2>;
          })}
        </div>
      </div>
    </>
  );
};

export default AllFiles;
