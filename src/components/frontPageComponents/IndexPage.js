import React from "react";
import "./style.css";
import { Link } from "react-router-dom";

export default class IndexPage extends React.Component {
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
            {" "}
            <Link to="/myPage">Min side</Link>{" "}
          </button>
          <button className="btn">
            <Link to="">Rediger en oppgave</Link>{" "}
          </button>
          <button className="btn">
            <Link to="/createNewLesson">Lag ny oppgave </Link>{" "}
          </button>
        </div>
      </div>
    );
  }
}
