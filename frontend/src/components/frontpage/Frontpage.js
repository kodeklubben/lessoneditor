import "./frontpage.scss";
import React, { useContext } from "react";

import ItemList from "./ItemList";
import { UserContext } from "../../contexts/UserContext";
import Navbar from "../navbar/Navbar";
import { useHistory } from "react-router-dom";

const Overview = () => {
  const history = useHistory();
  const context = useContext(UserContext);
  const { lessons } = context;
  const navigateToEditor = (lessonId, file) => {
    const target = ["/editor", lessonId, file].join("/");
    history.push(target);
  };

  return (
    <div>
      <Navbar />
      <div className="overViewContainer">
        <h3>Lag ny oppgave</h3>
        <div className="ui card">
          <div className="content">
            <a href={"/new-lesson"}>
              <div style={{ height: "200px" }}>
                <i className=" huge plus  icon"></i>
              </div>
            </a>
          </div>
        </div>

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
            navigateToEditor={navigateToEditor}
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
