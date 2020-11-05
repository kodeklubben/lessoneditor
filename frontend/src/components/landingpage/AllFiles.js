import "./landingpage.scss";
import React, { useContext } from "react";

import { LessonContext } from "contexts/LessonContext";

const AllFiles = () => {
  const lesson = useContext(LessonContext);
  const { lessonList } = lesson;

  const filteredArray =
    lessonList.length > 0
      ? lessonList.filter(
          (filteredItem) =>
            filteredItem.filename !== "data.json" &&
            filteredItem.filename !== "preview.png"
        )
      : "";

  return (
    <>
      <div style={{ marginBottom: "5em" }}>
        <div style={{ marginLeft: "5em" }}>
          {filteredArray.length > 0
            ? filteredArray.map((element, index) => {
                return <h2>{element.filename}</h2>;
              })
            : ""}
        </div>
      </div>
    </>
  );
};

export default AllFiles;
