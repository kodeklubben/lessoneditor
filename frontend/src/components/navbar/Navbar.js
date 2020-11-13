import "./navbar.scss";
import React, { useContext, useState } from "react";
import { useParams } from "react-router";
import ProfileMenu from "components/navbar/ProfileMenu";
import { UserContext } from "contexts/UserContext";
import { LessonContext } from "contexts/LessonContext";
import NewLessonButton from "../frontpage/newLessonButton";
import NewLesson from "../frontpage/NewLesson";

const Navbar = () => {
  const userContext = useContext(UserContext);
  const lessonContext = useContext(LessonContext);
  const { data } = lessonContext;
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

        {file !== undefined ? (
          <div className="navbar_course_title">
            <h1 style={{ margin: "auto" }}>
              <span style={{ color: "gray" }}>Prosjekttittel: </span>
              {data.lessonTitle}
            </h1>
            <h3 style={{ margin: "auto" }}>
              <span style={{ color: "gray" }}>Kurs: </span>
              {data.courseTitle}
            </h3>
          </div>
        ) : (
          ""
        )}

        <div className="navbar_profile">
          {file === undefined ? (
            <NewLessonButton setShowPopup={setShowPopup} />
          ) : (
            ""
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
