import React from "react";
import "./RightBoxStyle.css";

let boxTextHeader = "Informasjon";

let boxText = ["Ferdig behandlet", "Under behandling", "Jobbes med"];

function RightBox() {
  return (
    <div className="RightBox">
      <div className="informationTable">
        <p id="header">{boxTextHeader}</p>
      </div>
      {boxText.map((element, index) => (
        <div key={"element" + index}>
          <p>{element}</p>
        </div>
      ))}
    </div>
  );
}
export default RightBox;
