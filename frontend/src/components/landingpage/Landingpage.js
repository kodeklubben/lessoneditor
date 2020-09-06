import "./landingpage.scss";
import React, { useState, useContext, useEffect } from "react";
import { useParams, useHistory } from "react-router";
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
import { Dropdown } from "semantic-ui-react";
import COURSELIST from "components/editor/settingsFiles/COURSELIST";

const Landingpage = () => {
  const [pageContent, setPageContent] = useState("lessontexts");
  const [showSpinner, setShowSpinner] = useState(false);
  const [areYouSure, setAreYouSure] = useState(false);
  const [thankU, setThankU] = useState(false);
  const { lessonId, mode } = useParams();
  const history = useHistory();
  const lesson = useContext(LessonContext);
  const { data, saveLesson, lessonList } = lesson;

  const courseNotSlug = COURSELIST.find(({ slug }) => slug === data.course);

  const options = [
    { key: 1, text: "Modus: Elev", value: "lessontexts" },
    { key: 2, text: "Modus: Lærer", value: "teacherguides" },
    { key: 3, text: "Vis alle filer", value: "allfiles" },
  ];

  useEffect(() => {
    mode ? setPageContent(mode) : console.log("couldn't set site mode");
  }, [mode, data]);

  useEffect(() => {
    if (!data.course) {
      setShowSpinner(true);
    } else if (data.course) {
      setShowSpinner(false);
    }
  }, [data.course]);

  const handleChange = (e, { value }) => {
    setPageContent(value);
    const target = ["/landingpage", lessonId, value].join("/");
    history.push(target);
  };

  const onSubmit = async (lessonId) => {
    setShowSpinner(true);
    await saveLesson(data)
      .then(await submitLesson(lessonId))
      .then(() => {
        setShowSpinner(false);
        setAreYouSure(false);
        setThankU(true);
      });
  };

  const dropdownValue = (input) => {
    let returnValue;
    switch (input) {
      case "lessontexts":
        returnValue = (
          <LessonTexts lessonId={lessonId} lessonList={lessonList} />
        );
        break;
      case "teacherguides":
        returnValue = (
          <TeacherGuides lessonId={lessonId} lessonList={lessonList} />
        );
        break;
      case "allfiles":
        returnValue = <AllFiles />;
        break;
      default:
        break;
    }
    return returnValue;
  };

  return (
    <>
      {showSpinner ? <ShowSpinner /> : ""}
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
              <span style={{ color: "grey" }}>{"Prosjekttittel: "}</span>
              <span>{`${
                data.lesson ? data.lesson.replace(/-/g, " ") : ""
              }`}</span>{" "}
              <span>{`(Lærerveiledning)`}</span>
              <span style={{ color: "grey", marginLeft: "1em" }}>
                {" Kurs: "}
              </span>
              <span>{`${courseNotSlug?.courseTitle}`}</span>
            </>
          ) : (
            <>
              <span style={{ color: "grey" }}>{"Prosjekttittel: "}</span>
              <span>{`${
                data.lesson ? data.lesson.replace(/-/g, " ") : ""
              }`}</span>
              <span style={{ color: "grey", marginLeft: "1em" }}>
                {" Kurs: "}
              </span>
              <span>{`${courseNotSlug?.courseTitle}`}</span>
            </>
          )}
        </h2>
        <div style={{ display: "flex", float: "right" }}>
          <div style={{ position: "relative", top: "-3.5em" }}>
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
          </div>
          <Datapanel
            setShowSpinner={setShowSpinner}
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
};

export default Landingpage;
