import "./navbar.scss";
import React, { useContext } from "react";
import { useParams } from "react-router";
import ProfileMenu from "components/navbar/ProfileMenu";
import { UserContext } from "contexts/UserContext";
import { LessonContext } from "contexts/LessonContext";
import NewLessonModal from "../frontpage/NewLessonModal";
import { Button, Icon } from "semantic-ui-react";

const Navbar = () => {
  const userContext = useContext(UserContext);
  const lessonContext = useContext(LessonContext);
  const { file } = useParams();
  return (
    <nav className="navbar_container middle aligned ui grid">
      <div className="three wide column">
        <a href={"/"}>
          <img className="navbar_logo" alt="" src={"/lav_logo.jpg"} />
        </a>
      </div>

      <div className="nine wide column">
        {file === undefined ? (
          <NewLessonModal
            trigger={
              <Button basic>
                <Icon name={"plus"} />
                Ny oppgave
              </Button>
            }
          />
        ) : (
          <h1>
            <span style={{ color: "gray" }}>Prosjekttittel: </span>
            {lessonContext.data.lesson}
          </h1>
        )}
      </div>
      <div className={"right aligned four wide column"}>
        <a id="navbar_gohome" href={"/"}>
          <ProfileMenu
            name={userContext.user ? userContext.user.name : ""}
            email={userContext.user ? userContext.user.email : ""}
            photo={userContext.user ? userContext.user.photo : ""}
          />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
