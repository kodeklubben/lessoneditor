import "./landingpage.scss";
import { useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import TeacherGuides from "./TeacherGuides";
import LessonTexts from "./LessonTexts";
import AllFiles from "./AllFiles";
import LandingageNavbar from "./landingpageNavbar/LandingpageNavbar";
import SubmitModal from "./SubmitModal";
import Navbar from "../navbar/Navbar";
import { Button } from "semantic-ui-react";
import { useLessonContext } from "../../contexts/LessonContext";

const Landingpage = () => {
  const [openSubmitModal, setOpenSubmitModal] = useState(false);
  const { lessonId, mode } = useParams() as any;
  const pageContent = mode;
  const { state } = useLessonContext();

  const { lessonTitle, courseTitle, lessonSlug } = state.lesson;

  const dropdownValue = (input: string) => {
    switch (input) {
      case "lessontexts":
        return (
          <LessonTexts lessonId={lessonId} lessonTitle={lessonTitle} lessonSlug={lessonSlug} />
        );
      case "teacherguides":
        return (
          <TeacherGuides lessonId={lessonId} lessonTitle={lessonTitle} lessonSlug={lessonSlug} />
        );
      case "allfiles":
        return <AllFiles lessonId={lessonId} />;
      default:
        return;
    }
  };

  return (
    <>
      {openSubmitModal && (
        <SubmitModal
          openSubmitModal={openSubmitModal}
          setOpenSubmitModal={setOpenSubmitModal}
          lessonId={lessonId}
        />
      )}

      <Navbar />
      <div className="landingpage_container">
        <LandingageNavbar lessonTitle={lessonTitle} courseTitle={courseTitle} />

        <div className="card_container">{dropdownValue(pageContent)}</div>
        <div id="landingpageButtonContainer">
          <Link to={"/"}>
            <Button content="Tilbake" color="black" />
          </Link>
          <Button
            onClick={() => setOpenSubmitModal(true)}
            content="Sende inn oppgave"
            positive
            labelPosition="right"
            icon="github"
          />
        </div>
      </div>
    </>
  );
};

export default Landingpage;
