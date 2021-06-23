import "./navbar.scss";
import React, { useContext } from "react";
import { useParams } from "react-router";
import ProfileMenu from "components/navbar/ProfileMenu";
import { UserContext } from "contexts/UserContext";
import { LessonContext } from "contexts/LessonContext";
import NewLessonModal from "components/frontpage/NewLessonModal";

const Navbar = () => {
  const { user } = useContext(UserContext);
  const { lessonData } = useContext(LessonContext);

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
              {lessonData.lessonTitle
                ? lessonData.lessonTitle
                : lessonData.lesson}
            </h1>
            <h3 style={{ margin: "auto" }}>
              <span style={{ color: "gray" }}>Kurs: </span>
              {lessonData.courseTitle
                ? lessonData.courseTitle
                : lessonData.course}
            </h3>
          </div>
        ) : (
          ""
        )}
        <div className="navbar_profile">
          {file === undefined ? <NewLessonModal /> : ""}

          <a id="navbar_gohome" href={"/"}>
            <ProfileMenu
              name={user ? user.name : ""}
              email={user ? user.email : ""}
              photo={user ? user.photo : ""}
            />
          </a>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
