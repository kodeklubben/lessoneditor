import React from "react";

const Checkbox = props => {
  return (
    <div>
      <input
        type="checkbox"
        name={props.name}
        id={props.name}
        value={props.name}
        onChange={e => props.onCheck(e.target.value)}
      ></input>
      <label htmlFor={props.name}> {props.name} </label>
    </div>
  );
};

export default Checkbox;
