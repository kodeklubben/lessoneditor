import "./navbar.scss";
import React, { useContext, useRef } from "react";
import ProfileMenu from "components/ProfileMenu";
import COURSELIST from "components/lessonForm/settingsFiles/COURSELIST";
import { UserContext } from "contexts/UserContext";

const Navbar = ({ course, title, setTitle }) => {
  const context = useContext(UserContext);
  const test = useRef();

  const courseNotSlug = COURSELIST.find(({ slug }) => slug === course);
  const lessonTitleHandler = (event) => {
    setTitle(event.target.value);
  };

  const onKeyUpHandler = (event) => {
    if (event.key === "Enter") {
      test.current.blur();
    }
  };

  return (
    <div>
      <nav className="header_container">
        <div className="header_logo">
          <a href={"//kidsakoder.no"}>
            <img className="header_logo" alt="" src={"/lav_logo.jpg"} />
          </a>
        </div>

        {course ? (
          <div className="header_title">
            <span style={{ color: "grey", marginTop: "1vh" }}>
              <h1>{courseNotSlug?.courseTitle + ":"}</h1>
            </span>
            <span>
              <input
                ref={test}
                autoComplete="off"
                style={{
                  marginTop: "0.2em",
                  fontSize: "2.5em",
                  fontWeight: "bolder",
                  width:
                    title && title.length < 40 && title.length > 12
                      ? title.length + 20 + "vh"
                      : 60 + "vh",
                }}
                id="titleInput"
                onChange={lessonTitleHandler}
                onKeyUp={onKeyUpHandler}
                value={title}
                placeholder="ingen tittel"
              />
            </span>
          </div>
        ) : (
          ""
        )}

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
