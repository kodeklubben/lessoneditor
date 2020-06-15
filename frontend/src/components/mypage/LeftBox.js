import React from "react";
import "./LeftBoxStyle.css";

let boxTextHeader = "Hopp til";

let boxCourses = ["Python", "Javascript"];

function LeftBox() {
  return (
    <div className="LeftBox">
      <div className="informationTable">
        <p id="header">{boxTextHeader}</p>
      </div>
      {boxCourses.map((element, index) => (
        <div key={"element" + index}>
          <p>{element}</p>
        </div>
      ))}
    </div>
  );
}
export default LeftBox;
