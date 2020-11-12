import "./itemlist.scss";
import React from "react";
import { COURSESLIST } from "components/editor/settingsFiles/COURSELIST";

const getCourseFromSlug = (input) =>
  COURSESLIST.find(({ slug }) => slug === input);

function ItemList({ items, removeLesson, navigateToHome }) {
  return (
    <div className="ui five column grid">
      {items.length > 0 &&
        items.map((listitem, index) => {
          return (
            <div key={"listitem" + index} className="column">
              <div className="ui fluid card">
                <div className="image itemListImage">
                  <img
                    src={`${listitem.thumb}?${performance.now()}`}
                    alt={"oppgavebilde"}
                  />
                </div>
                <div className="content">
                  <div className="header">
                    {listitem.lessonTitle
                      ? listitem.lessonTitle
                      : listitem.lesson}
                  </div>
                  <div className="meta">
                    <h4>{getCourseFromSlug(listitem.course)?.courseTitle}</h4>
                  </div>
                </div>
                <div className="extra content">
                  <button
                    className="ui button"
                    onClick={() => navigateToHome(listitem.lessonId)}
                  >
                    Åpne
                  </button>
                  <button
                    className="ui button"
                    onClick={async () => {
                      await removeLesson(listitem.lessonId);
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
  );
}
export default ItemList;
