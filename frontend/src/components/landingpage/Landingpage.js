import "./landingpage.scss";
import React, { useContext } from "react";
import { useParams, useHistory } from "react-router";
import Navbar from "components/navbar/Navbar";
import Datapanel from "./datapanel/Datapanel";
import LessonCard from "./LessonCard";
import { LessonContext } from "contexts/LessonContext";
import { UserContext } from "../../contexts/UserContext";
import submitLesson from "api/submit-lesson";

const Landingpage = () => {
  const history = useHistory();
  const { lessonId } = useParams();
  const lesson = useContext(LessonContext);
  const { data, lessonList, saveLesson } = lesson;

  console.log(`
  data : ${JSON.stringify(data)}, 
  
  lessonList : ${JSON.stringify(lessonList)}`);

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
  console.log(languages);

  return (
    <>
      <Navbar />
      <div style={{ marginBottom: "5em" }} className="landing_navbar">
        <h2>{data.lesson}</h2>
        <div style={{ display: "flex", float: "right" }}>
          <Datapanel />
        </div>
      </div>
      <div style={{ marginBottom: "5em" }}>
        <div style={{ display: "flex" }}>
          {allLanguages.map((element) => {
            return (
              <LessonCard
                language={element}
                hasContent={languages.includes(element)}
                thumbUrl={thumbUrl}
                lessonId={lessonId}
                lessonTitle={data.lesson}
              />
            );
          })}
        </div>
      </div>

      <a href={"/"}>
        <button className="ui button" onClick={onSubmit}>
          Tilbake
        </button>
      </a>
      <button className="ui button" onClick={onSubmit}>
        Sende inn
      </button>
    </>
  );
};

export default Landingpage;
