import "./itemlist.scss";
import React from "react";

function ItemList({ items, removeLesson, navigateToHome }) {
  return (
    <div className="ui five column grid">
      {items.length > 0 &&
        items.map((listitem, index) => {
          return (
            <div key={"listitem" + index} className="column">
              <div className="ui fluid card">
                <div className="image itemListImage">
                  <img src={listitem.thumb} alt={"oppgavebilde"} />
                </div>
                <div className="content">
                  <div className="header">{listitem.lesson}</div>
                  <div className="meta">
                    <h4>{listitem.course}</h4>
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
