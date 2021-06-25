import "./landingpage.scss";
import React, { useContext, useState } from "react";
import { useHistory, useParams } from "react-router";
import Navbar from "components/navbar/Navbar";
import TeacherGuides from "./TeacherGuides";
import LessonTexts from "./LessonTexts";
import AllFiles from "./AllFiles";
import Datapanel from "./datapanel/Datapanel";
import Areyousure from "./AreyousurePopup";
import ThankU from "./ThankU";
import { LessonContext } from "contexts/LessonContext";
import submitLesson from "api/submit-lesson";
import ShowSpinner from "../ShowSpinner";
import { Dropdown, Popup, Button } from "semantic-ui-react";

const Landingpage = () => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [areYouSure, setAreYouSure] = useState(false);
  const [thankU, setThankU] = useState(false);
  const [openDataPopup, setOpenDataPopup] = useState(false);
  const { lessonId, mode } = useParams();
  const pageContent = mode;
  const history = useHistory();
  const { lessonData, saveLesson, lessonList } = useContext(LessonContext);

  const options = [
    { key: 1, text: "Oppgaver", value: "lessontexts" },
    { key: 2, text: "Lærerveiledning", value: "teacherguides" },
    { key: 3, text: "Alle filer", value: "allfiles" },
  ];

  const handleChange = (e, { value }) => {
    const target = ["/landingpage", lessonId, value].join("/");
    history.push(target);
  };

  const onSubmit = async (lessonId) => {
    setShowSpinner(true);
    await saveLesson(lessonData);
    await submitLesson(lessonId);
    setShowSpinner(false);
    setAreYouSure(false);
    setThankU(true);
  };
  const lessonTitle = lessonData.lessonTitle;

  const courseTitle = lessonData.courseTitle;

  const dropdownValue = (input) => {
    switch (input) {
      case "lessontexts":
        return (
          <LessonTexts
            lessonId={lessonId}
            lessonList={lessonList}
            lessonTitle={lessonData.lesson}
          />
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
        <div
          style={
            pageContent === "lessontexts"
              ? { backgroundColor: "#b1daae" }
              : pageContent === "teacherguides"
              ? { backgroundColor: "#a3cccb" }
              : { backgroundColor: "#cca3a3" }
          }
          className="landing_navbar"
        >
          <h2>
            {pageContent === "teacherguides" ? (
              <>
                <span style={{ color: "grey" }}>Prosjekttittel: </span>
                <span>{lessonTitle}</span> <span>{`(Lærerveiledning)`}</span>
                <span style={{ color: "grey", marginLeft: "1em" }}>Kurs: </span>
                <span>{courseTitle}</span>
              </>
            ) : (
              <>
                <span style={{ color: "grey" }}>Prosjekttittel: </span>
                <span>{lessonTitle}</span>
                <span style={{ color: "grey", marginLeft: "1em" }}>Kurs: </span>
                <span>{courseTitle}</span>
              </>
            )}
          </h2>
          <div style={{ display: "flex", float: "right" }}>
            <div style={{ position: "relative", top: "-3.5em" }}>
              <Popup
                content={"Oversikt prosjektfiler"}
                mouseEnterDelay={250}
                mouseLeaveDelay={250}
                trigger={
                  <Dropdown
                    style={{
                      maxWidth: "3em",
                      border: "1px solid grey",
                    }}
                    onChange={handleChange}
                    options={options}
                    placeholder="Choose an option"
                    selection
                    value={pageContent}
                  />
                }
              />
            </div>
            <Datapanel
              openDataPopup={openDataPopup}
              setOpenDataPopup={setOpenDataPopup}
              lessonId={lessonId}
              mode={mode}
            />
          </div>
        </div>

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

        <div className="temporary" style={{ marginTop: "3em" }}>
          <a href={"/"}>
            <Button content="Tilbake" />
          </a>
          <Button onClick={() => setAreYouSure(true)} content="Sende inn" />
        </div>
      </>
    );
  }
};

export default Landingpage;
