import React from "react";
import "./style.css";
import { Link } from "react-router-dom";

export class IndexPage extends React.Component {
  render() {
    return (
      <div className="StartPageContainer">
        <div className="quote">
          <p>
            "Programs must be written for people to read, and only incidentally
            for machines to execute."
          </p>
          <p id="author">Harold Abelson </p>
        </div>
        <div className="btnDiv">
          <button className="btn">
            <Link to="">Min side</Link>
          </button>
          <button className="btn">
            <Link to="">Rediger en oppgave</Link>
          </button>
          <Link to="/createNewLesson" className="btn">
            <button>Lag ny oppgave</button>
          </Link>
        </div>
      </div>
    );
  }
}
