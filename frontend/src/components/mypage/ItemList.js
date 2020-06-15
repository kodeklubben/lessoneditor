import React from "react";

function ItemList({ items }) {
  const mystyle = {
    padding: "10px",
    fontFamily: "Arial",
    fontSize: "20px",
  };

  return (
    <>
      <div className=".container my-container">
        <div className="ui middle aligned divided list">
          {items.map((listitem, index) => (
            <div className="item" key={"listitem" + index}>
              <div className="right floated content">
                <div className="ui button">Rediger</div>
              </div>
              <div className="content" style={mystyle}>
                {listitem}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ItemList;
