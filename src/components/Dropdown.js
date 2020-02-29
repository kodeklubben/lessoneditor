import React from "react";

const Dropdown = props => {
  return (
    <div
      onClick={() =>
        props.onButtonClick(
          props.output,
          props.cursorIntON,
          props.cursorIntOFF,
          props.bTitle,
          props.endOutput
        )
      }
    >
      <option>{props.title}</option>
    </div>
  );
};

export default Dropdown;
