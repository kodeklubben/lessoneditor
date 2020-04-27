import React from "react";
import "./style.css";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import GoogleAuth from "../GoogleAuth";

const IndexPage = props => {
  const indPage = () => {
    if (props.isSignedIn) {
      return (
        <div className="StartPageContainer">
          <div className="ui right aligned grid">
            <div className="right floated column">
              <GoogleAuth />
            </div>
          </div>

          <div className="quote">
            <p>
              "Programs must be written for people to read, and only
              incidentally for machines to execute."
            </p>
            <p id="author">Harold Abelson </p>
          </div>
          <div />
          <div>
            <h2>Velkommen {props.firstName}</h2>
          </div>
          <div className="btnDiv">
            <Link to="/myPage" className="link">
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
    } else if (!props.isSignedIn) {
      return (
        <div className="StartPageContainer">
          <div className="quote">
            <p>
              "Programs must be written for people to read, and only
              incidentally for machines to execute."
            </p>
            <p id="author">Harold Abelson </p>
          </div>
          <div />
          <div className="ui container">
            <h2>Logg inn:</h2>
          </div>
          <div className="center">
            <GoogleAuth />
          </div>
        </div>
      );
    }
  };
  return indPage();
};

const mapStateToProps = state => {
  return { isSignedIn: state.auth.isSignedIn, firstName: state.auth.firstName };
};

export default connect(mapStateToProps)(IndexPage);
