import "./navbar.scss";
import React, { useContext, useState } from "react";
import { useParams } from "react-router";
import ProfileMenu from "components/navbar/ProfileMenu";
import { UserContext } from "contexts/UserContext";
import NewLessonButton from "../frontpage/newLessonButton";
import NewLesson from "../frontpage/NewLesson";

const Navbar = () => {
  const userContext = useContext(UserContext);
  const [showPopup, setShowPopup] = useState(false);

  const { file } = useParams();

  return (
    <div>
      <nav className="navbar_container">
        <div className="navbar_logo">
          <a href={"/"}>
            <img className="navbar_logo" alt="" src={"/lav_logo.jpg"} />
          </a>
        </div>

        <div className="navbar_profile">
          {file === undefined ? (
            <NewLessonButton setShowPopup={setShowPopup} />
          ) : (
            <h1 style={{ paddingRight: "17em" }}>
              <span style={{ color: "gray" }}>Prosjekttittel: </span> {file}
            </h1>
          )}
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
