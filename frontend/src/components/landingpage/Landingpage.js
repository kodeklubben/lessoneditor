import "./landingpage.scss";
import React, { useContext, useState, useEffect } from "react";
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
import { Dropdown, Popup } from "semantic-ui-react";

const Landingpage = () => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [areYouSure, setAreYouSure] = useState(false);
  const [thankU, setThankU] = useState(false);
  const [open, setOpen] = useState(false);
  const { lessonId, mode } = useParams();
  const pageContent = mode;
  const history = useHistory();
  const { lessonData, getYmlData, saveLesson, lessonList } = useContext(
    LessonContext
  );

  useEffect(() => {
    async function compareObjects() {
      const ymlData = await getYmlData();
      if (
        JSON.stringify(ymlData.tags) ===
        JSON.stringify({ topic: [], subject: [], grade: [] })
      ) {
        setOpen(true);
      }
    }
    compareObjects();
  }, [getYmlData]);

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
  const lessonSlug = lessonData.lesson;
  const courseTitle = lessonData.courseTitle;

  const dropdownValue = (input) => {
    switch (input) {
      case "lessontexts":
        return (
          <LessonTexts
            lessonId={lessonId}
            lessonList={lessonList}
            lessonTitle={lessonSlug}
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

  console.log({
    pageContent,
    showSpinner,
    areYouSure,
    thankU,
    open,
    lessonId,
    mode,
    lessonData,
  });
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
              open={open}
              setOpen={setOpen}
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

        <a href={"/"}>
          <button className="ui button">Tilbake</button>
        </a>
        <button
          className="ui button"
          onClick={() => {
            setAreYouSure(true);
          }}
        >
          Sende inn
        </button>
      </>
    );
  }
};

export default Landingpage;
