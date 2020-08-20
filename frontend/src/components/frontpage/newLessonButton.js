import React, { useContext, useState } from "react";
import NewLesson from "./NewLesson";
import ItemList from "./ItemList";
import { UserContext } from "../../contexts/UserContext";
import Navbar from "../navbar/Navbar";
import { useHistory } from "react-router-dom";
import "./newLessonButton.css";
//<i className=" plus sign"></i>

//<div style={{ height: "200px" }} onClick={() => setShowPopup(true)}>
//            <i className=" huge plus  icon"></i>
const NewLessonButton = ({ setShowPopup }) => {
  return (
    <div className="newLessonButton">
      <div className="content">
        <button className="huge plus icon" onClick={setShowPopup}>
          {" "}
          Lag ny oppgave
        </button>
      </div>
    </div>
  );
};
export default NewLessonButton;
