import "./landingpage.scss";
import React, { useContext } from "react";
import { useParams, useHistory } from "react-router";
import Navbar from "components/navbar/Navbar";
import Datapanel from "./datapanel/Datapanel";
import { LessonContext } from "contexts/LessonContext";
import submitLesson from "api/submit-lesson";

// const languageOptions = [
//   {
//     key: 1,
//     text: "Bokmål",
//     value: "nb",
//     image: { avatar: true, src: "/languagesFlag/flag_nb.svg" },
//   },
//   {
//     key: 2,
//     text: "Nynorsk",
//     value: "nn",
//     image: { avatar: true, src: "/languagesFlag/flag_nn.svg" },
//   },
//   {
//     key: 3,
//     text: "Engelsk",
//     value: "en",
//     image: { avatar: true, src: "/languagesFlag/flag_en.svg" },
//   },
//   {
//     key: 4,
//     text: "Islandsk",
//     value: "is",
//     image: { avatar: true, src: "/languagesFlag/flag_is.svg" },
//   },
// ];

const Landingpage = () => {
  const history = useHistory();
  const { lessonId } = useParams();
  const lesson = useContext(LessonContext);
  const { data, lessonList, saveLesson } = lesson;

  const navigateToEditor = (lessonId, file) => {
    const target = ["/editor", lessonId, file].join("/");
    history.push(target);
  };

  const onSubmit = async () => {
    await saveLesson(data);
    await submitLesson(lessonId);
    alert("submitted");
  };

  return (
    <>
      <Navbar />
      <div className="landing_navbar">
        <h2>{data.lesson}</h2>
        <div style={{ display: "flex", float: "right" }}>
          <Datapanel />
        </div>
      </div>

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
      <button className="ui button" onClick={onSubmit}>
        Submit
      </button>
    </>
  );
};

export default Landingpage;
