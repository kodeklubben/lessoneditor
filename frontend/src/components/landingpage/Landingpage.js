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

import { Dropdown } from "semantic-ui-react";

const Landingpage = () => {
  const [pageContet, setPageContent] = useState("lessontexts");
  const [showSpinner, setShowSpinner] = useState(false);
  const [areYouSure, setAreYouSure] = useState(false);
  const [thankU, setThankU] = useState(false);
  const [thumbUrl, setThumbUrl] = useState("");
  const { lessonId } = useParams();
  const lesson = useContext(LessonContext);
  const { data, lessonList, saveLesson } = lesson;

  const options = [
    { key: 1, text: "Modus: Elev", value: "lessontexts" },
    { key: 2, text: "Modus: Lærer", value: "teacherguides" },
    { key: 3, text: "Vis alle filer", value: "allfiles" },
  ];

  const handleChange = (e, { value }) => setPageContent(value);

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
      <div
        style={
          pageContet === "lessontexts"
            ? { backgroundColor: "#b1daae" }
            : pageContet === "teacherguides"
            ? { backgroundColor: "#a3cccb" }
            : { backgroundColor: "#cca3a3" }
        }
        className="landing_navbar"
      >
        <h2>
          {pageContet === "teacherguides"
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
              value={pageContet}
            />
          </div>
          <Datapanel lessonId={lessonId} />
        </div>
      </div>

      {dropdownValue(pageContet)}

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
