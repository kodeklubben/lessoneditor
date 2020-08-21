import "./navbar.scss";
import React, { useContext, useState } from "react";
import Languages from "./Languages";
import ProfileMenu from "components/ProfileMenu";
import { UserContext } from "contexts/UserContext";
import NewLessonButton from "../frontpage/newLessonButton";
import NewLesson from "../frontpage/NewLesson";

const Navbar = ({ course }) => {
  const userContext = useContext(UserContext);
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      <nav className="navbar_container">
        <div className="navbar_logo">
          <a href={"//kidsakoder.no"}>
            <img className="navbar_logo" alt="" src={"/lav_logo.jpg"} />
          </a>
        </div>

        <div className="navbar_profile">
          <Languages />
          <NewLessonButton setShowPopup={setShowPopup} />
          {showPopup ? <NewLesson setShowPopup={setShowPopup} /> : ""}
          <ProfileMenu
            name={userContext.user ? userContext.user.name : ""}
            email={userContext.user ? userContext.user.email : ""}
            photo={userContext.user ? userContext.user.photo : ""}
          />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
