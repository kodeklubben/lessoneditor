import React from "react";
import { useHistory } from "react-router-dom";

function ItemList({ items }) {
  const history = useHistory();
  const mystyle = {
    padding: "10px",
    fontFamily: "Arial",
    fontSize: "20px",
  };
  const navigateToEditor = (course, lesson) => {
    const target = ["/editor", course, lesson, lesson].join("/");
    history.push(target);
  };
  return (
    <>
      <div className=".container my-container">
        <div className="ui middle aligned divided list">
          {items.map((listitem, index) => (
            <div className="item" key={"listitem" + index}>
              <div className="right floated content">
                <div
                  className="ui button"
                  onClick={() =>
                    navigateToEditor(listitem.course, listitem.lesson)
                  }
                >
                  Rediger
                </div>
              </div>
              <div className="content" style={mystyle}>
                {listitem.title} ({listitem.course})
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ItemList;
