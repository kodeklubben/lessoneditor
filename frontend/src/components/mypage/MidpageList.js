import "./itemlist.css";
import React from "react";
import { useHistory } from "react-router-dom";

function MidpageList({ items, lessonScreenshots }) {
  const history = useHistory();
  const navigateToEditor = (course, lesson) => {
    const target = ["/editor", course, lesson, lesson].join("/");
    history.push(target);
  };

  const submitHandler = () => {
    console.log("text submitted");
    history.push("/endPage");
  };

  return (
    <>
      <div className="ui five column grid">
        {items.map((listitem, index) => {
          return (
            <div key={"listitem" + index} className="column">
              <div className="ui fluid card">
                <div className="image">
                  <img
                    src={lessonScreenshots[Math.floor(Math.random() * 5)]}
                    alt={"oppgavebilde"}
                  />
                </div>
                <div className="content">
                  <div className="header">{listitem.title}</div>
                  <div className="meta">
                    <h4>{listitem.course}</h4>
                  </div>
                </div>
                <div className="extra content">
                  <button
                    className="ui button"
                    onClick={() =>
                      navigateToEditor(listitem.course, listitem.lesson)
                    }
                  >
                    Åpne
                  </button>

                  <button
                    className="ui right labeled icon button"
                    onClick={submitHandler}
                  >
                    <i className="right arrow icon"></i>
                    Sende Inn
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
export default MidpageList;
