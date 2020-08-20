import React, { useContext, useState } from "react";
import NewLesson from "./NewLesson";
import ItemList from "./ItemList";
import { UserContext } from "../../contexts/UserContext";
import Navbar from "../navbar/Navbar";
import { useHistory } from "react-router-dom";

const NewLessonButton = ({ setShowPopup }) => {
  return (
    <div className="newLessonButton">
      <h3>Lag ny oppgave</h3>
      <div className="content">
        <div style={{ height: "200px" }} onClick={() => setShowPopup(true)}>
          <i className=" huge plus  icon"></i>
        </div>
      </div>
    </div>
  );
};
export default NewLessonButton;
