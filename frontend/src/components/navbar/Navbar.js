import "./navbar.css";
import React, { useContext, useState } from "react";
import ProfileMenu from "components/ProfileMenu";
import { Input } from "semantic-ui-react";

import { UserContext } from "contexts/UserContext";

const Navbar = ({ title, course }) => {
  const context = useContext(UserContext);
  const [lessonTitle, setLessonTitle] = useState(title);
  return (
    <div>
      <nav className="header_container">
        <div className="header_logo">
          <a href={"//kidsakoder.no"}>
            <img className="header_logo" alt="" src={"/lav_logo.jpg"} />
          </a>
        </div>

        <div className="header_title">
          <span style={{ color: "grey", marginTop: "1vh" }}>
            <h1>{course ? course + ":" : ""}</h1>
          </span>
          <span>
            <Input
              style={{
                marginTop: "0.1em",
                fontSize: "2.5em",
                fontWeight: "bolder",
                width:
                  lessonTitle.length < 40
                    ? lessonTitle.length - 1 + "ch"
                    : 40 + "ch",
              }}
              id="titleInput"
              size="massive"
              transparent
              onChange={(e) => setLessonTitle(e.target.value)}
              value={lessonTitle}
              placeholder="ingen tittel"
            />
          </span>
        </div>

        <div className="header_profile">
          <ProfileMenu
            name={context.user ? context.user.name : ""}
            email={context.user ? context.user.email : ""}
            photo={context.user ? context.user.photo : ""}
          />
        </div>
      </nav>
    </div>
  );
};
export default Navbar;
