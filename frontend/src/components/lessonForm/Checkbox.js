import React from "react";

const Checkbox = (props) => {
  const onInputChange = (event) => {
    props.onCheck(event);
  };

  return (
    <div className="ui checkbox">
      <input
        type="checkbox"
        name={props.subtag}
        id={props.value}
        value={props.value}
        onChange={onInputChange}
      />
      <label style={{ cursor: "pointer" }} htmlFor={props.value}>
        {props.name}
      </label>
    </div>
  );
};

export default Checkbox;
