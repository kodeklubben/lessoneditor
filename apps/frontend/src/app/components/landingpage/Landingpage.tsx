import "./landingpage.scss";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import TeacherGuides from "./TeacherGuides";
import LessonTexts from "./LessonTexts";
import AllFiles from "./AllFiles";
import LandingageNavbar from "./landingpageNavbar/LandingpageNavbar";
import Areyousure from "./AreyousurePopup";
import ThankU from "./ThankU";
import Navbar from "../navbar/Navbar";
import { Button } from "semantic-ui-react";
import { useLessonContext } from "../../contexts/LessonContext";

const Landingpage = () => {
  const [areYouSure, setAreYouSure] = useState(false);
  const [thankU, setThankU] = useState(false);
  const { lessonId, mode } = useParams() as any;
  const pageContent = mode;
  const { state, updateFileList } = useLessonContext();

  const { lessonTitle, courseTitle, lessonSlug } = state.lesson;
  const fileList = state.files;

  useEffect(() => {
    updateFileList();
  }, [state.files]);

  const dropdownValue = (input: string) => {
    switch (input) {
      case "lessontexts":
        return (
          <LessonTexts
            lessonId={lessonId}
            fileList={fileList}
            lessonTitle={lessonTitle}
            lessonSlug={lessonSlug}
          />
        );
      case "teacherguides":
        return (
          <TeacherGuides
            lessonId={lessonId}
            fileList={fileList}
            lessonTitle={lessonTitle}
            lessonSlug={lessonSlug}
          />
        );
      case "allfiles":
        return <AllFiles lessonId={lessonId} />;
      default:
        return;
    }
  };

  return (
    <>
      {areYouSure && (
        <Areyousure setAreYouSure={setAreYouSure} setThankU={setThankU} lessonId={lessonId} />
      )}

      {thankU && <ThankU setThankU={setThankU} />}

      <Navbar />
      <div className="landingpage_container">
        <LandingageNavbar lessonTitle={lessonTitle} courseTitle={courseTitle} />

        <div className="card_container">{dropdownValue(pageContent)}</div>
        <div id="landingpageButtonContainer">
          <Link to={"/"}>
            <Button content="Tilbake" color="black" />
          </Link>
          <Button
            onClick={() => setAreYouSure(true)}
            content="Sende inn oppgave"
            positive
            labelPosition="right"
            icon="arrow right"
          />
        </div>
      </div>
    </>
  );
};

export default Landingpage;
