import "./landingpage.scss";
import React, { useState, useContext } from "react";
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

import { Dropdown } from "semantic-ui-react";

const Landingpage = () => {
  const [pageContet, setPageContent] = useState("lessontexts");
  const [showSpinner, setShowSpinner] = useState(false);
  const [areYouSure, setAreYouSure] = useState(false);
  const [thankU, setThankU] = useState(false);
  const { lessonId } = useParams();
  const lesson = useContext(LessonContext);
  const { data, lessonList, saveLesson } = lesson;

  console.log(pageContet);

  let thumbUrl;

  const options = [
    { key: 1, text: "Vis Oppgavetekster", value: "lessontexts" },
    { key: 2, text: "Vis Lærerveiledninger", value: "teacherguides" },
    { key: 3, text: "Vis alle filer", value: "allfiles" },
  ];

  const handleChange = (e, { value }) => setPageContent(value);

  if (
    Object.keys(lessonList).length !== 0 &&
    lessonList.constructor !== Object
  ) {
    lessonList.forEach((item) => {
      if (item.filename === "preview.png") {
        thumbUrl = item.url;
      }
    });
  }

  const onSubmit = async () => {
    setShowSpinner(true);
    await saveLesson(data);
    await submitLesson(lessonId);
    setShowSpinner(false);
    setAreYouSure(false);
    setThankU(true);
  };

  const test = (input) => {
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
        returnValue = (
          <AllFiles
            thumbUrl={thumbUrl}
            lessonId={lessonId}
            lessonList={lessonList}
          />
        );
        break;
      default:
        break;
    }
    return returnValue;
  };

  return (
    <>
      <Navbar />
      <div style={{ marginBottom: "5em" }} className="landing_navbar">
        <h2>{`${data.lesson} (${data.course})`} </h2>
        <div style={{ display: "flex", float: "right" }}>
          <Datapanel />
        </div>
        <Dropdown
          onChange={handleChange}
          options={options}
          placeholder="Choose an option"
          selection
          value={pageContet}
        />
      </div>

      {test(pageContet)}

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
