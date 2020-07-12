import React, { useContext } from "react";
import "./overview.css";

import ItemList from "./ItemList";
import { UserContext } from "../../contexts/UserContext";

const lessonScreenshots = [
  "lessonsScreenshots/Screenshot 2020-07-12 at 09.42.03.png",
  "lessonsScreenshots/Screenshot 2020-07-12 at 09.42.22.png",
  "lessonsScreenshots/Screenshot 2020-07-12 at 09.42.41.png",
  "lessonsScreenshots/Screenshot 2020-07-12 at 09.42.58.png",
  "lessonsScreenshots/Screenshot 2020-07-12 at 09.43.15.png",
];

const Overview = () => {
  const context = useContext(UserContext);
  const { lessons } = context.user;
  return (
    <div className="overViewContainer">
      <h3>Lag ny oppgave</h3>
      <div className="ui card">
        <div className="content">
          <a href={"/new-lesson"}>
            <div style={{ height: "200px" }}>
              <i className=" huge plus  icon"></i>
            </div>{" "}
          </a>
        </div>
      </div>

      <div style={{ marginTop: "50px" }} class="ui horizontal divider">
        ...
      </div>

      <h3>Mine oppgaver</h3>
      {lessons ? (
        <div className="">
          <div className="">
            <div className="">
              <div className="">
                <ItemList
                  lessonScreenshots={lessonScreenshots}
                  items={lessons}
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <b>Du har ingen kurs</b>
      )}
      <br />
    </div>
  );
};
export default Overview;
