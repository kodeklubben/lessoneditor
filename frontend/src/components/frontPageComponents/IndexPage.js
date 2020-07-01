import React, { useContext } from "react";
import "./style.css";
import { Link } from "react-router-dom";
import ProfileMenu from "../ProfileMenu";
import { UserContext } from "../UserContext";

const buttonContent = [
  { link: "/myPage", name: "Min side" },
  { link: "", name: "Rediger en oppgave" },
  { link: "/createNewLesson", name: "Lag ny oppgave" },
];

const IndexPage = () => {
  const user = useContext(UserContext);

  return (
    <div className="StartPageContainer">
      <div className="ui right aligned grid">
        <div className="right floated column">
          <ProfileMenu name={user.name} email={user.email} />
        </div>
      </div>
      <div style={{ margin: "1rem" }} />
      <div className="quote">
        <p>
          "Programs must be written for people to read, and only incidentally
          for machines to execute."
        </p>
        <p id="author">Harold Abelson </p>
      </div>
      <div />

      <div className="btnDiv">
        {buttonContent.map((element, index) => (
          <Link key={"element" + index} to={element.link} className="link">
            <button className="btn">{element.name}</button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default IndexPage;
