import React from "react";
import { Link, Redirect } from "react-router-dom";

const PageButtons = props => {
  if (props.state.redirect) {
    return <Redirect to={props.state.redirect} />;
  }

  return (
    <div>
      <Link to={props.prevValue}>
        <button className="ui icon left labeled button" type="button">
          <i aria-hidden="true" className="left arrow icon" />
          {props.prevTitle}
        </button>
      </Link>

      <button
        className="ui right floated icon right labeled button"
        type="button"
        onClick={props.mySubmitHandler}
      >
        <i aria-hidden="true" className="right arrow icon" />
        {props.nextTitle}
      </button>
    </div>
  );
};

export default PageButtons;
