import "./navbar.scss";
import React, { useContext, useState } from "react";
import ProfileMenu from "components/navbar/ProfileMenu";
import { UserContext } from "contexts/UserContext";
import NewLessonButton from "../frontpage/newLessonButton";
import NewLesson from "../frontpage/NewLesson";

const Navbar = () => {
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
          <NewLessonButton setShowPopup={setShowPopup} />
          {showPopup ? <NewLesson setShowPopup={setShowPopup} /> : ""}
          <a id="navbar_gohome" href={"/"}>
            <ProfileMenu
              name={userContext.user ? userContext.user.name : ""}
              email={userContext.user ? userContext.user.email : ""}
              photo={userContext.user ? userContext.user.photo : ""}
            />
          </a>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
