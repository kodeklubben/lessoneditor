import React from "react";
import "./endpage.css";

const closeMessage = "Tilbake til min side";
const greeting =
  "Takk for ditt bidrag til Lær Kidsa Koding! Ditt bidrag er nå inne til vurdering";

const EndPage = () => {
  return (
    <div>
      <div className="greeting">
        <p>{greeting}</p>
      </div>

      <button className="closeBtn">
        <a href={"/"}>{closeMessage}</a>{" "}
      </button>
    </div>
  );
};

export default EndPage;
