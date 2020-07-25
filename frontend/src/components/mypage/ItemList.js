import "./itemlist.css";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import { UserContext } from "../../contexts/UserContext";

import SimplePreview from "components/simple-preview/simple-preview";

function ItemList({ items, lessonScreenshots }) {
  const history = useHistory();

  const context = useContext(UserContext);

  const navigateToEditor = (course, lesson) => {
    const target = ["/lesson", course, lesson].join("/");
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
                  <SimplePreview
                    lessonScreenshots={lessonScreenshots}
                    course={listitem.course}
                    lesson={listitem.lesson}
                    file={listitem.title}
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
                    onClick={() =>
                      context.removeLesson(listitem.course, listitem.lesson)
                    }
                  >
                    fjerne
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
