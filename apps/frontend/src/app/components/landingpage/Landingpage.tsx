import "./landingpage.scss";
import { useState } from "react";
import { useParams } from "react-router";

import TeacherGuides from "./TeacherGuides";
import LessonTexts from "./LessonTexts";
import AllFiles from "./AllFiles";
import LandingageNavbar from "./landingpageNavbar/LandingpageNavbar";
import Areyousure from "./AreyousurePopup";
import ThankU from "./ThankU";
import submitLesson from "../../api/submit-lesson";
import ShowSpinner from "../ShowSpinner";
import { Button } from "semantic-ui-react";
import Navbar from "../navbar/Navbar";
import { useLessonContext } from "../../contexts/LessonContext";

const Landingpage = () => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [areYouSure, setAreYouSure] = useState(false);
  const [thankU, setThankU] = useState(false);
  const { lessonId, mode } = useParams<any>();
  const pageContent = mode;
  const { state, updateLesson } = useLessonContext();

  const onSubmit = async (lessonId: string) => {
    setShowSpinner(true);
    await submitLesson(lessonId);
    setShowSpinner(false);
    setAreYouSure(false);
    setThankU(true);
  };

  const lessonList = state.files;
  const lessonTitle = state.lesson?.lessonTitle;
  const courseTitle = state.lesson?.courseTitle;

  const dropdownValue = (input: string) => {
    switch (input) {
      case "lessontexts":
        return (
          <LessonTexts lessonId={lessonId} lessonList={lessonList} lessonTitle={lessonTitle} />
        );
      case "teacherguides":
        return <TeacherGuides lessonId={lessonId} lessonList={lessonList} />;
      case "allfiles":
        return <AllFiles />;
      default:
        return;
    }
  };

  if (showSpinner || !state.lesson) {
    return <ShowSpinner />;
  } else {
    return (
      <>
        {areYouSure && (
          <Areyousure
            onSubmit={onSubmit}
            setAreYouSure={setAreYouSure}
            showSpinner={showSpinner}
            lessonId={lessonId}
          />
        )}

        {thankU && <ThankU setThankU={setThankU} />}

        <Navbar />
        <div className="landingpage_container">
          <LandingageNavbar lessonTitle={lessonTitle} courseTitle={courseTitle} />

          <div className="card_container">{dropdownValue(pageContent)}</div>
          <div id="landingpageButtonContainer">
            <a href={"/"}>
              <Button content="Tilbake" color="black" />
            </a>
            <Button
              onClick={() => setAreYouSure(true)}
              content="Sende inn"
              positive
              labelPosition="right"
              icon="arrow right"
            />
          </div>
        </div>
      </>
    );
  }
};

export default Landingpage;
