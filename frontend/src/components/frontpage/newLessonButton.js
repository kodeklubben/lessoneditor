import React, { useContext, useState } from "react";
import NewLesson from "./NewLesson";
import ItemList from "./ItemList";
import { UserContext } from "../../contexts/UserContext";
import Navbar from "../navbar/Navbar";
import { useHistory } from "react-router-dom";
import "./newLessonButton.css";

const NewLessonButton = ({ setShowPopup }) => {
  return (
    <div className="newLessonButton">
      <div className="content">
        <div className="new-lesson-button" onClick={setShowPopup}>
          {" "}
          <img id="plusSign" src={"/plusSign.png"} />
          Ny oppgave
        </div>
      </div>
    </div>
  );
};
export default NewLessonButton;
