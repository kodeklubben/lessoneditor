import React from "react";
import "./style.css";

let closeMessage = "Lukk vindu";
let greeting =
  "Takk for ditt bidrag til Lær Kidsa Koding! Ditt bidrag er nå inne til vurdering";

const EndPage = () => {
  return (
    <div>
      <div className="greeting">
        <p>{greeting}</p>
      </div>

      <button className="closeBtn"> {closeMessage} </button>
    </div>
  );
};

export default EndPage;
