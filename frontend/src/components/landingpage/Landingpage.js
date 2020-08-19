import "./landingpage.scss";
import React, { useContext } from "react";
import { useParams, useHistory } from "react-router";
import Navbar from "components/navbar/Navbar";
import Datapanel from "./datapanel/Datapanel";
import { LessonContext } from "contexts/LessonContext";

const Landingpage = () => {
  const history = useHistory();
  const { lessonId } = useParams();
  const lesson = useContext(LessonContext);
  const { data, fetchList, lessonList, language } = lesson;

  const navigateToEditor = (lessonId, file) => {
    const target = ["/editor", lessonId, file].join("/");
    history.push(target);
  };

  fetchList(lessonId);

  console.log(lessonList);

  return (
    <>
      <Navbar />
      <div className="landing_navbar">
        <h2>{data.lesson}</h2>
        <div style={{ float: "right" }}>
          <Datapanel />
        </div>
      </div>

      <h3>Lag ny tekstfil:</h3>
      <div className="ui card">
        <div className="content">
          <div
            style={{ height: "200px" }}
            onClick={() =>
              navigateToEditor(lessonId, data.lesson + "_" + language)
            }
          >
            <i className=" huge plus  icon"></i>
          </div>
        </div>
      </div>

      <p>__________________________</p>

      <a href="/">
        <button className="ui button">Tilbake</button>
      </a>
    </>
  );
};

export default Landingpage;
