import "./frontpage.scss";
import React, { useContext, useState } from "react";
import NewLesson from "./NewLesson";
import ItemList from "./ItemList";
import { UserContext } from "../../contexts/UserContext";
import Navbar from "../navbar/Navbar";
import { useHistory } from "react-router-dom";
import NewLessonButton from "./newLessonButton";
import ShowSpinner from "../ShowSpinner";

const Overview = () => {
  const [showPopup, setShowPopup] = useState(false); // Les om useState i React
  const [showSpinner, setShowSpinner] = useState(false);
  const history = useHistory();
  const context = useContext(UserContext);
  const { lessons } = context;
  const navigateToHome = (lessonId, file) => {
    const target = ["/landingpage", lessonId, "lessontexts"].join("/");
    history.push(target);
  };

  return (
    <div>
      {showSpinner ? <ShowSpinner /> : ""}
      <Navbar />
      <div className="overViewContainer">
        <p id="welcome">Velkommen, </p>
        <NewLessonButton setShowPopup={setShowPopup} id="newLessonButton" />

        {showPopup ? (
          <NewLesson
            showSpinner={showSpinner}
            setShowSpinner={setShowSpinner}
            setShowPopup={setShowPopup}
          />
        ) : (
          ""
        )}

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

        {lessons.length > 0 ? (
          <>
            <p
              style={{
                fontStyle: 'Arial, "Times New Roman", Times, serif',
                fontSize: "23px",
              }}
            >
              Mine oppgaver
            </p>
            <ItemList
              items={lessons}
              removeLesson={context.removeLesson}
              navigateToHome={navigateToHome}
            />
          </>
        ) : (
          <p
            style={{
              fontStyle: 'Arial, "Times New Roman", Times, serif',
              fontSize: "23px",
            }}
          >
            Du har ingen kurs
          </p>
        )}
        <br />
      </div>
    </div>
  );
};
export default Overview;
