import "./landingpage.scss";
import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router";
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

const Landingpage = () => {
  const [pageContent, setPageContent] = useState("lessontexts");
  const [showSpinner, setShowSpinner] = useState(false);
  const [areYouSure, setAreYouSure] = useState(false);
  const [thankU, setThankU] = useState(false);
  const [thumbUrl, setThumbUrl] = useState("");
  const { lessonId, mode } = useParams();
  const lesson = useContext(LessonContext);
  const { data, saveLesson, lessonList } = lesson;

  const options = [
    { key: 1, text: "Modus: Elev", value: "lessontexts" },
    { key: 2, text: "Modus: Lærer", value: "teacherguides" },
    { key: 3, text: "Vis alle filer", value: "allfiles" },
  ];

  useEffect(() => {
    mode ? setPageContent(mode) : console.log("error");
  }, [mode]);

  useEffect(() => {
    if (
      Object.keys(lessonList).length !== 0 &&
      lessonList.constructor !== Object
    ) {
      lessonList.forEach((item) => {
        if (item.filename === "preview.png") {
          setThumbUrl(item.url);
        }
      });
    }
  });

  const handleChange = (e, { value }) => setPageContent(value);

  const onSubmit = async () => {
    setShowSpinner(true);
    await saveLesson(data);
    await submitLesson(lessonId);
    setShowSpinner(false);
    setAreYouSure(false);
    setThankU(true);
  };

  const dropdownValue = (input) => {
    let returnValue;
    switch (input) {
      case "lessontexts":
        returnValue = (
          <LessonTexts
            thumbUrl={thumbUrl}
            lessonId={lessonId}
            lessonList={lessonList}
          />
        );
        break;
      case "teacherguides":
        returnValue = (
          <TeacherGuides
            thumbUrl={thumbUrl}
            lessonId={lessonId}
            lessonList={lessonList}
          />
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
          {pageContent === "teacherguides"
            ? `${data.lesson} (${data.course}) - Lærerveiledning`
            : `${data.lesson} (${data.course})`}{" "}
        </h2>
        <div style={{ display: "flex", float: "right" }}>
          <div style={{ position: "relative", top: "-3.5em" }}>
            <Dropdown
              style={{
                maxWidth: "3em",
                backgroundColor: "rgba(0,0,0,0)",
                border: "1px solid grey",
              }}
              onChange={handleChange}
              options={options}
              placeholder="Choose an option"
              selection
              value={pageContent}
            />
          </div>
          <Datapanel setShowSpinner={setShowSpinner} lessonId={lessonId} />
        </div>
      </div>

      {dropdownValue(pageContent)}

      {areYouSure ? (
        <Areyousure
          onSubmit={onSubmit}
          setAreYouSure={setAreYouSure}
          showSpinner={showSpinner}
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
