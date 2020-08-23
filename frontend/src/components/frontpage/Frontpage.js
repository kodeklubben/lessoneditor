import "./frontpage.scss";
import React, { useContext, useState } from "react";
import NewLesson from "./NewLesson";
import ItemList from "./ItemList";
import { UserContext } from "../../contexts/UserContext";
import Navbar from "../navbar/Navbar";
import { useHistory } from "react-router-dom";
import NewLessonButton from "./newLessonButton";

const Overview = () => {
  const [showPopup, setShowPopup] = useState(false); // Les om useState i React
  const history = useHistory();
  const context = useContext(UserContext);
  const { lessons } = context;
  const navigateToHome = (lessonId, file) => {
    const target = ["/landingpage", lessonId].join("/");
    history.push(target);
  };

  return (
    <div>
      <Navbar />
      <div className="overViewContainer">
        <p id="welcome">Velkommen, </p>
        <NewLessonButton setShowPopup={setShowPopup} id="newLessonButton" />

        {showPopup ? <NewLesson setShowPopup={setShowPopup} /> : ""}

        <div
          style={{
            backgroundColor: "grey",
            width: "90%",
            margin: "auto",
            marginTop: "60px",
            marginBottom: "50px",
            height: "2px",
          }}
          className="ui horizontal divider"
        />

        <h3>Mine oppgaver</h3>
        {lessons ? (
          <ItemList
            items={lessons}
            removeLesson={context.removeLesson}
            navigateToHome={navigateToHome}
          />
        ) : (
          <b>Du har ingen kurs</b>
        )}
        <br />
      </div>
    </div>
  );
};
export default Overview;
