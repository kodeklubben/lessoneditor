import "./navbar.css";
import React, { useContext } from "react";
import ProfileMenu from "components/ProfileMenu";

import { UserContext } from "contexts/UserContext";

const Navbar = ({ title, course }) => {
  const context = useContext(UserContext);
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
          <span style={{ marginTop: "1vh" }}>
            <h1>{title}</h1>
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
