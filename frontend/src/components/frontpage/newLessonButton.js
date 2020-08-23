import React from "react";
import "./newLessonButton.css";

const NewLessonButton = ({ setShowPopup }) => {
  return (
    <div className="newLessonButton">
      <div className="content">
        <div className="new-lesson-button" onClick={setShowPopup}>
          {" "}
          <img id="plusSign" alt="plusSign" src={"/plusSign.png"} />
          Ny oppgave
        </div>
      </div>
    </div>
  );
};
export default NewLessonButton;
