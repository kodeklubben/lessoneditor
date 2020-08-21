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
  const { data, lessonList } = lesson;

  const navigateToEditor = (lessonId, file) => {
    const target = ["/editor", lessonId, file].join("/");

    history.push(target);
  };

  // const ymlTest = `level: 2
  // license: "[Code Club World Limited Terms of Service](https://github.com/CodeClub/scratch-curriculum/blob/master/LICENSE.md)"
  // tags:
  //   topic: [text_based]
  //   subject: [programming, arts_and_crafts]
  //   grade: [junior]`;

  return (
    <>
      <Navbar />
      <div className="landing_navbar">
        <h2>{data.lesson}</h2>
        <div style={{ float: "right" }}>
          <Datapanel />
        </div>
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
