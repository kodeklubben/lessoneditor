import React from "react";
import "./style.css";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import GoogleAuth from "../GoogleAuth";
import ProfileMenu from "../ProfileMenu";

const buttonText = ["Min side", "Rediger en oppgave", "Lag ny oppgave"];

const IndexPage = props => {
  const indPage = () => {
    if (props.isSignedIn) {
      return (
        <div className="StartPageContainer">
          <div className="ui right aligned grid">
            <div className="right floated column">
              <ProfileMenu />
            </div>
          </div>
          <div style={{ margin: "1rem" }} />
          <div className="quote">
            <p>
              "Programs must be written for people to read, and only
              incidentally for machines to execute."
            </p>
            <p id="author">Harold Abelson </p>
          </div>
          <div />

          <div className="btnDiv">
            <Link to="/myPage" className="link">
              <button className="btn">{buttonText[0]}</button>
            </Link>
            <Link to="" className="link">
              <button className="btn">{buttonText[1]}</button>
            </Link>
            <Link to="/createNewLesson" className="link">
              <button className="btn">{buttonText[2]}</button>
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
          <div className="ui center container" />
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
