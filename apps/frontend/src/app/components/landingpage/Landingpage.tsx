import "./landingpage.scss";
import React, { useState } from "react";
import { Card, Divider, Icon, Button, Dropdown, Placeholder } from "semantic-ui-react";
import Navbar from "../navbar/Navbar";
import NewLesson from "./NewLesson";
import CourseInfo from "./CourseInfo";
import Content from "./Content";
import { useLessonContext } from "../../contexts/LessonContext";
import { useParams, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import SubmitModal from "./SubmitModal";

const Landingpage = () => {
  const [openSubmitModal, setOpenSubmitModal] = useState(false);
  const { lessonId, mode } = useParams() as any;
  const { state } = useLessonContext();

  const navigate = useNavigate();

  const { lessonTitle, courseTitle, lessonSlug } = state.lesson;

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
        <section className="landingpage_section1">
          <div className="landingpage_section1_content">
            <div>
              <CourseInfo lessonTitle={lessonTitle} courseTitle={courseTitle} />
              <NewLesson />
              <div className="landingpageButtonContainer">
                <Button
                  icon={"arrow left"}
                  content="Tilbake"
                  onClick={() => navigate("/")}
                  labelPosition="left"
                />

                <Button
                  onClick={() => setOpenSubmitModal(true)}
                  content="Sende inn oppgave"
                  positive
                  labelPosition="right"
                  icon="github"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="landingpage_section2">
          <Content />
        </section>
      </div>
    </>
  );
};

export default Landingpage;
