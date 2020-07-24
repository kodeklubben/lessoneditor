import "./header.css";
import React, { useContext } from "react";
import ProfileMenu from "components/ProfileMenu";

import { UserContext } from "contexts/UserContext";

function Header() {
  const context = useContext(UserContext);
  return (
    <div>
      <div className="header_container">
        <div className="logo">
          <a href={"//kidsakoder.no"}>
            <img className="header_logo" alt="" src={"/lav_logo.jpg"} />
          </a>
        </div>
        <div className="header_profile">
          <ProfileMenu
            name={context.user ? context.user.name : ""}
            email={context.user ? context.user.email : ""}
            photo={context.user ? context.user.photo : ""}
          />
        </div>
      </div>
    </div>
  );
}
export default Header;
