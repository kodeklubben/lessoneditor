import "./landingpage.scss";
import React, { useState, useContext } from "react";
import { useParams } from "react-router";
import Navbar from "components/navbar/Navbar";
import Datapanel from "./datapanel/Datapanel";
import Areyousure from "./AreyousurePopup";
import ThankU from "./ThankU";
import LessonCard from "./LessonCard";
import { LessonContext } from "contexts/LessonContext";
import submitLesson from "api/submit-lesson";

const Landingpage = () => {
  const [showSpinner, setShowSpinner] = useState(false);
  const [areYouSure, setAreYouSure] = useState(false);
  const [thankU, setThankU] = useState(false);
  const { lessonId } = useParams();
  const lesson = useContext(LessonContext);
  const { data, lessonList, saveLesson } = lesson;

  let languages = [];
  let allLanguages = ["nb", "nn", "en", "is"];
  let thumbUrl;

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

  if (
    Object.keys(lessonList).length !== 0 &&
    lessonList.constructor !== Object
  ) {
    lessonList.forEach((element) => {
      switch (
        element.filename.slice(-2) === "md" &&
        element.filename.slice(5) !== "read" &&
        element.filename.slice(-5, -3)
      ) {
        case "nn":
          if (!languages.includes("nn")) {
            languages.push("nn");
          }
          break;
        case "en":
          if (!languages.includes("en")) {
            languages.push("en");
          }
          break;
        case "is":
          if (!languages.includes("is")) {
            languages.push("is");
          }
          break;
        default:
          if (!languages.includes("nb")) {
            languages.push("nb");
          }
          break;
      }
    });
  }

  return (
    <>
      <Navbar />
      <div style={{ marginBottom: "5em" }} className="landing_navbar">
        <h2>{`${data.lesson} (${data.course})`} </h2>
        <div style={{ display: "flex", float: "right" }}>
          <Datapanel />
        </div>
      </div>

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

      <div style={{ marginBottom: "5em" }}>
        <div style={{ display: "flex" }}>
          {allLanguages.map((element, index) => {
            return (
              <div key={element + index}>
                <LessonCard
                  language={element}
                  hasContent={languages.includes(element)}
                  thumbUrl={thumbUrl}
                  lessonId={lessonId}
                  lessonTitle={data.lesson}
                />
              </div>
            );
          })}
        </div>
      </div>

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
