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
          <Link to="" className="link">
            <button className="btn">Min side</button>
          </Link>
          <Link to="" className="link">
            <button className="btn">Rediger en oppgave</button>
          </Link>
          <Link to="/createNewLesson" className="link">
            <button className="btn">Lag ny oppgave</button>
          </Link>
        </div>
      </div>
    );
  }
}
