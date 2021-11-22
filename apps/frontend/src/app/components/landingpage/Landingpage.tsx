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
import LessonData from "./datapanel/LessonData";
import MDPreview from "../editor/MDPreview";
import { Button, Container, Grid, Menu, Segment, Icon, Image, Item } from "semantic-ui-react";
import { useLessonContext } from "../../contexts/LessonContext";

const Landingpage = () => {
  const [areYouSure, setAreYouSure] = useState(false);
  const [thankU, setThankU] = useState(false);
  const { lessonId, mode } = useParams<any>();
  const pageContent = mode;
  const { state } = useLessonContext();

  const lessonList = state.files;
  const lessonTitle = state.lesson?.lessonTitle;
  const courseTitle = state.lesson?.courseTitle;
  const lessonSlug = state.lesson.lessonSlug;

  const dropdownValue = (input: string) => {
    switch (input) {
      case "lessontexts":
        return (
          <LessonTexts
            lessonId={lessonId}
            lessonList={lessonList}
            lessonTitle={lessonTitle}
            lessonSlug={lessonSlug}
          />
        );
      case "teacherguides":
        return (
          <TeacherGuides
            lessonId={lessonId}
            lessonList={lessonList}
            lessonTitle={lessonTitle}
            lessonSlug={lessonSlug}
          />
        );
      case "allfiles":
        return <AllFiles />;
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
            content="Sende inn"
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
