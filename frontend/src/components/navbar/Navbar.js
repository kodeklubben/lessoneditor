import "./navbar.css";
import React, { useContext } from "react";
import ProfileMenu from "components/ProfileMenu";

import { UserContext } from "contexts/UserContext";
import { useHistory } from "react-router-dom";

const Navbar = ({ course, lesson }) => {
  const context = useContext(UserContext);

  const history = useHistory();

  const navigateToHomePage = () => {
    history.push("/");
  };

  return (
    <div>
      <nav className="header_container">
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
        <div className="header_homebutton">
          <button
            className="ui right floated button"
            id="buttonpanel"
            onClick={navigateToHomePage}
          >
            <i className="home right icon" />
          </button>
        </div>
      </nav>
    </div>
  );
};
export default Navbar;
