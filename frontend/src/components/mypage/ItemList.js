import "./itemlist.css";
import React from "react";
import { useHistory } from "react-router-dom";

function ItemList({ items, lessonScreenshots }) {
  const history = useHistory();

  const navigateToEditor = (course, lesson) => {
    const target = ["/mid-page", course, lesson, lesson].join("/");
    history.push(target);
  };

  const submitHandler = () => {
    console.log("text submitted");
    history.push("/endPage");
  };

  return (
    <>
      <div className="ui link cards">
        {items.map((listitem, index) => (
          <div className="card" key={"listitem" + index}>
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
              <div
                className="ui button"
                onClick={() =>
                  navigateToEditor(listitem.course, listitem.lesson)
                }
              >
                Åpne
              </div>
              <div className="ui button" onClick={submitHandler}>
                Sende Inn
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
export default ItemList;
