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
  const { data, lessonList, language } = lesson;

  const navigateToEditor = (lessonId, file) => {
    const target = ["/editor", lessonId, file].join("/");

    history.push(target);
  };

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
            onClick={async () =>
              language !== "nb"
                ? navigateToEditor(
                    lessonId,
                    (await data.lesson) + "_" + language
                  )
                : navigateToEditor(lessonId, await data.lesson)
            }
          >
            <i className=" huge plus  icon"></i>
          </div>
        </div>
        <button className="ui button">submit</button>
      </div>

      <div
        style={{
          backgroundColor: "grey",
          width: "90%",
          margin: "auto",
          marginTop: "60px",
          marginBottom: "50px",
          height: "2px",
        }}
        className="ui horizontal divider"
      />

      {Object.keys(lessonList).length !== 0 && lessonList.constructor !== Object
        ? lessonList.map((listItem, index) => {
            if (listItem.filename.slice(-3) === ".md") {
              return (
                <div key={listItem + index} className="column">
                  <div className="ui fluid card">
                    {/* <div className="image itemListImage">
                    <img src={listitem.thumb} alt={"oppgavebilde"} />
                  </div> */}
                    <div className="content">
                      <div className="header">
                        {listItem.filename.slice(0, -3)}
                      </div>
                      {/* <div className="meta">
                      <h4>{listitem.course}</h4>
                    </div> */}
                    </div>
                    <div className="extra content">
                      <button
                        className="ui button"
                        onClick={() =>
                          navigateToEditor(
                            lessonId,
                            listItem.filename.slice(0, -3)
                          )
                        }
                      >
                        Åpne
                      </button>
                      {/* <button
                      className="ui button"
                      onClick={async () => {
                        await removeLesson(listitem.lessonId);
                      }}
                    >
                      Fjerne
                    </button> */}
                    </div>
                  </div>
                </div>
              );
            } else {
              return "";
            }
          })
        : ""}
    </>
  );
};

export default Landingpage;
