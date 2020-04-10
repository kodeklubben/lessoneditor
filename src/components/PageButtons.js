import React from "react";
import { Link } from "react-router-dom";

const PageButtons = props => {
  return (
<<<<<<< HEAD
    <div>
      <Link to={props.prevValue}>
        <button className="ui icon left labeled button" type="button">
          <i aria-hidden="true" className="left arrow icon" />
          {props.prevTitle}
        </button>
      </Link>
      <Link to={props.nextValue}>
        <button
          className="ui right floated icon right labeled button"
          type="button"
        >
          <i aria-hidden="true" className="right arrow icon" />
          {props.nextTitle}
        </button>
      </Link>
=======
    <div className="">
      <button className="ui icon left labeled button" type="button">
        <i aria-hidden="true" className="left arrow icon"></i>
        <Link to={props.prevValue}>{props.prevTitle}</Link>
      </button>
      <button
        className="ui right floated icon right labeled button"
        type="button"
        onClick={props.mySubmitHandler}
      >
        <Link to={props.nextValue}>{props.nextTitle}</Link>
        <i aria-hidden="true" className="right arrow icon"></i>
      </button>
>>>>>>> 58f85a7af74e27673aa4bdffe88acd1d936acb43
    </div>
  );
};

export default PageButtons;
