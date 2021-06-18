import "./frontpage.scss";
import React, { useContext, useState } from "react";
import NewLesson from "./NewLesson";
import ItemList from "./ItemList";
import { UserContext } from "../../contexts/UserContext";
import Navbar from "../navbar/Navbar";
import { useHistory } from "react-router-dom";
import NewLessonButton from "./newLessonButton";
import ShowSpinner from "../ShowSpinner";
import {Divider, Header, Message} from 'semantic-ui-react';

const Overview = () => {
  const [showPopup, setShowPopup] = useState(false); // Les om useState i React
  const [showSpinner, setShowSpinner] = useState(false);
  const history = useHistory();
  const userContext = useContext(UserContext);
  const { lessons, removeLesson } = userContext;
  const navigateToHome = (lessonId) => {
    const target = ["/landingpage", lessonId, "lessontexts"].join("/");
    history.push(target);
  };

  return (
    <div>
      {showSpinner ? <ShowSpinner /> : ""}
      <Navbar />
      <div className="overViewContainer">
        <NewLessonButton setShowPopup={setShowPopup} />
        {showPopup ? (
          <NewLesson
            showSpinner={showSpinner}
            setShowSpinner={setShowSpinner}
            setShowPopup={setShowPopup}
          />
        ) : (
          ""
        )}
        <Divider style={{height: "2px"}} section/>
        {lessons.length > 0 ? (
          <>
            <Header as="h2">Mine oppgaver</Header>
            <ItemList
              items={lessons}
              removeLesson={removeLesson}
              navigateToHome={navigateToHome}
            />
          </>
        ) : (
            <Message>
              <Message.Header>Du har ingen kurs</Message.Header>
              <Message.Content>Opprett en ny oppgave ved å
              trykke på knappen "Ny oppgave"
              </Message.Content>
            </Message>
        )}
        <br />
      </div>
    </div>
  );
};
export default Overview;
