import "./itemlist.css";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import { UserContext } from "../../contexts/UserContext";

function ItemList({ items, lessonScreenshots }) {
  const history = useHistory();

  const context = useContext(UserContext);

  const navigateToEditor = (course, lesson) => {
    const target = ["/editor", course, lesson, lesson].join("/");
    history.push(target);
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
                    className="ui button"
                    onClick={() => {
                      context.removeLesson(listitem.course, listitem.lesson);
                      window.location.reload();
                    }}
                  >
                    Fjerne
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
export default ItemList;