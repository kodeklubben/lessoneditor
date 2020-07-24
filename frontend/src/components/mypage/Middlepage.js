import React, { useContext } from "react";
import "./overview.css";

import ItemList from "./ItemList";
import { UserContext } from "../../contexts/UserContext";
import Header from "../Header/Header";

const lessonScreenshots = [
  "lessonsScreenshots/Screenshot 2020-07-12 at 09.42.03.png",
  "lessonsScreenshots/Screenshot 2020-07-12 at 09.42.22.png",
  "lessonsScreenshots/Screenshot 2020-07-12 at 09.42.41.png",
  "lessonsScreenshots/Screenshot 2020-07-12 at 09.42.58.png",
  "lessonsScreenshots/Screenshot 2020-07-12 at 09.43.15.png",
];

const Middlepage = () => {
  const context = useContext(UserContext);
  const { lessons } = context.user;
  return (
    <div>
      <Header />

      <h1>Oppgave Tittel</h1>
      <div className="overViewContainer">
        <h3>Markdown tekstfiler</h3>
        {lessons ? (
          <div className="">
            <div className="">
              <div className="">
                <div className="">
                  <ItemList
                    items={lessons}
                    lessonScreenshots={lessonScreenshots}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <b>Du har ingen kurs</b>
        )}
        <br />
        <div style={{ marginTop: "50px" }} className="ui horizontal divider">
          ...
        </div>
        <h3>Lag ny oppgavetekst</h3>
        <div className="ui card">
          <div className="content">
            <a href={"/new-lesson"}>
              <div style={{ height: "200px" }}>
                <i className=" huge plus  icon"></i>
              </div>{" "}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Middlepage;
