import React, { useContext } from "react";
import "./OverviewStyle.css";

import Navbar from "./Navbar";
import ItemList from "./ItemList";
import LeftBox from "./LeftBox";
import RightBox from "./RightBox";
import { UserContext } from "../UserContext";

const Overview = () => {
  const context = useContext(UserContext);
  const { lessons } = context.user;
  return (
    <div>
      <Navbar />
      {lessons ? (
        <div className="OverviewBox">
          <div className="ui stackable four column grid">
            <div className="row">
              <div className="left floated computer only three wide column">
                <LeftBox />
              </div>
              <div className="eight wide column">
                <ItemList items={lessons} />
              </div>
              <div className="right floated computer only three wide column">
                <RightBox />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <b>Du har ingen kurs</b>
      )}
      <br />
      <a href={"/new-lesson"}>Ny oppgave</a>
    </div>
  );
};
export default Overview;
