import React from "react";
import { Link } from "react-router-dom";

const PageButtons = props => {
  return (
    <div className="">
      <button className="ui icon left labeled button" type="button">
        <i aria-hidden="true" className="left arrow icon"></i>
        <Link to={props.prevValue}>{props.prevTitle}</Link>
      </button>
      <button
        className="ui icon right labeled button toRight"
        type="button"
        onClick={props.mySubmitHandler}
      >
        <Link to={props.nextValue}>{props.nextTitle}</Link>
        <i aria-hidden="true" className="right arrow icon"></i>
      </button>
    </div>
  );
};

export default PageButtons;
