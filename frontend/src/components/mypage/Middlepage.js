import React, { useContext } from "react";
import "./overview.css";
import MidpageList from "./MidpageList";
import { UserContext } from "../../contexts/UserContext";
import Navbar from "../navbar/Navbar";

const lessonScreenshots = [
  "/lessonsScreenshots/Screenshot 2020-07-12 at 09.42.03.png",
  "/lessonsScreenshots/Screenshot 2020-07-12 at 09.42.22.png",
  "/lessonsScreenshots/Screenshot 2020-07-12 at 09.42.41.png",
  "/lessonsScreenshots/Screenshot 2020-07-12 at 09.42.58.png",
  "/lessonsScreenshots/Screenshot 2020-07-12 at 09.43.15.png",
];

const Middlepage = () => {
  const context = useContext(UserContext);
  const { lessons } = context.user;
  return (
    <div>
      <Navbar />
      <h1>{"oppgave"}</h1>
      <div className="overViewContainer">
        <div className="ui two column grid">
          <div className="column">
            <h3>Lag ny oppgavetekst</h3>
            <div className="ui card">
              <div className="content">
                <a href={"/new-lesson"}>
                  <div style={{ height: "200px" }}>
                    <i className=" huge plus  icon"></i>
                  </div>
                </a>
              </div>
            </div>
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
        <h3>Oppgave tekstfiler</h3>
        {lessons ? (
          <MidpageList items={lessons} lessonScreenshots={lessonScreenshots} />
        ) : (
          <b>Du har ingen kurs</b>
        )}
      </div>
    </div>
  );
};
export default Middlepage;
