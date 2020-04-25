import React from "react";
// import "./style.css";

export default class EndPage extends React.Component {
  render() {
    return (
      <div>
        <div className="greeting">
          <p>Takk for ditt bidrag til Lær Kidsa Koding!</p>
          <p>Ditt bidrag er nå inne til vurdering. </p>
        </div>

        <button className="closeBtn"> Lukk vindu </button>
      </div>
    );
  }
}
