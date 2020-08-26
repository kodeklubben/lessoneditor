import "./landingpage.scss";
import React, { useState, useContext } from "react";
import { useParams } from "react-router";
import Navbar from "components/navbar/Navbar";
import Datapanel from "./datapanel/Datapanel";
import LessonCard from "./LessonCard";
import { LessonContext } from "contexts/LessonContext";
import { UserContext } from "../../contexts/UserContext";
import submitLesson from "api/submit-lesson";

const Landingpage = () => {
  const [areYouSure, setAreYouSure] = useState(false);
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
    await saveLesson(data);
    await submitLesson(lessonId);
    alert("submitted");
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
        <h2>{data.lesson}</h2>
        <div style={{ display: "flex", float: "right" }}>
          <Datapanel />
        </div>
      </div>

      {areYouSure ? (
        <div
          style={{
            position: "absolute",
            top: "0%",
            left: "0%",
            zIndex: "1",
            width: "100%",
            height: "100%",
            backgroundColor: "rgb(256,256,256,0.7)",
          }}
        >
          <div
            style={{
              zIndex: "2",
              margin: "auto",
              marginTop: "10%",
              padding: "10%",
              width: "50%",
              height: "50%",
              backgroundColor: "white",
              border: "5px solid red",
            }}
          >
            <h1>Alert(!):Vil du __virkelig__ sende inn oppgaven...?</h1>
            <i className="big bomb icon"></i>
            <button
              style={{ backgroundColor: "red" }}
              className="ui button"
              onClick={onSubmit}
            >
              Sende inn
            </button>
            <i className="big bomb icon"></i>
            <br />
            <i className="big red heart icon"></i>
            <button
              style={{ backgroundColor: "green" }}
              className="ui button"
              onClick={() => setAreYouSure(false)}
            >
              Få meg tilbake til trygg grunn...
            </button>
            <i className="big birthday cake icon"></i>
          </div>
        </div>
      ) : (
        ""
      )}

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
