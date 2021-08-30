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
  const { lessonData, saveLesson } = useLessonContext();

  const onSubmit = async (lessonId: string) => {
    setShowSpinner(true);
    await saveLesson(lessonData);
    await submitLesson(lessonId);
    setShowSpinner(false);
    setAreYouSure(false);
    setThankU(true);
  };

  const lessonList = lessonData.files;
  const lessonTitle = lessonData.lessonTitle;
  const courseTitle = lessonData.courseTitle;

  // @ts-ignore
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
        break;
    }
  };

  if (showSpinner || !lessonData.lesson) {
    return <ShowSpinner />;
  } else {
    return (
      <>
        <Navbar />
        <div className="landingpage_container">
          <LandingageNavbar lessonTitle={lessonTitle} courseTitle={courseTitle} />

          <div className="card_container">
            {dropdownValue(pageContent)}

            {areYouSure ? (
              <Areyousure
                onSubmit={onSubmit}
                setAreYouSure={setAreYouSure}
                showSpinner={showSpinner}
                lessonId={lessonId}
              />
            ) : (
              ""
            )}

            {thankU ? <ThankU setThankU={setThankU} /> : ""}
          </div>
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
