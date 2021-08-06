import "./navbar.scss";
import { FC } from "react";
import { useParams } from "react-router";
import ProfileMenu from "./ProfileMenu";
import { useUserContext } from "../../contexts/UserContext";

import logo from "/assets/public/lav_logo.jpg";
import { useLessonContext } from "../../contexts/LessonContext";

const Navbar: FC<any> = () => {
  const { user } = useUserContext();
  const { lessonData } = useLessonContext();

  const { file } = useParams<any>();

  return (
    <div>
      <nav className="navbar_container">
        <div className="navbar_logo">
          <a href={"/"}>
            <img className="navbar_logo" alt="" src={logo} />
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
