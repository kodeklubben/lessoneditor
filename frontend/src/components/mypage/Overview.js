import React from "react";
import "./OverviewStyleBckup.css";
import Navbar from "./Navbar";
import ItemList from "./ItemList";
import LeftBox from "./LeftBox";
import RightBox from "./RightBox";

const Overview = () => {
  const oppgaver = [
    "Oppgave 1",
    "Oppgave 2",
    "Oppgave 3",
    "Oppgave 4",
    "Oppgave 5"
  ];
  return (
    <div>
      <Navbar />
      <div className="OverviewBox">
        <div className="ui stackable four column grid">
          <div className="row">
            <div className="left floated computer only three wide column">
              <LeftBox />
            </div>
            <div className="eight wide column">
              <ItemList items={oppgaver} />
            </div>
            <div className="right floated computer only three wide column">
              <RightBox />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Overview;
