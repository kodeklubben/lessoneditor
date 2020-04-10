import React from "react";
import { Link } from "react-router-dom";

const PageButtons = props => {
  return (
    <div>
      <Link to={props.prevValue}>
        <button className="ui icon left labeled button" type="button">
          <i aria-hidden="true" className="left arrow icon" />
          {props.prevTitle}
        </button>
      </Link>
      <Link to={props.nextValue} onSubmit={props.mySubmitHandler}>
        <button
          className="ui right floated icon right labeled button"
          type="submit"
          onSubmit={props.mySubmitHandler}
        >
          <i aria-hidden="true" className="right arrow icon" />
          {props.nextTitle}
        </button>
      </Link>
    </div>
  );
};

export default PageButtons;
