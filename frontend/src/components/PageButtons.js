import React from "react";
import { Link, Redirect } from "react-router-dom";

const VALIDATION_ERROR = "* må fylles ut";

const PageButtons = (props) => {
  if (props.state.redirect) {
    return <Redirect to={props.state.redirect} />;
  }

  const validate = () => {
    let err = "";

    if (!props.state.title && props.err === "title") {
      err = VALIDATION_ERROR;
    }
    if (!props.state.authorList.length > 0 && props.err === "author") {
      if (props.state.author) return true;
      err = VALIDATION_ERROR;
    }

    if (err) {
      props.setErr(err);
      return false;
    }

    return true;
  };

  const onClickHandler = (input) => {
    if (input > 0) {
      var notErr = validate();
    }

    if (notErr && props.state.pageNumber === 3) {
      props.submitHandler(true);
      return;
    }
    if (notErr && props.state.isEditor) {
      props.submitHandler(true);
      return;
    }
    if (notErr || input < 1) {
      props.setPageNumber(props.state.pageNumber + input);
    } else {
      return;
    }
  };

  return (
    <React.Fragment>
      {props.state.pageNumber === 1 || props.state.isEditor ? (
        <Link to="/">
          <button id="backButton" className="ui button" type="button">
            <i aria-hidden="true" className="" />
            {props.prevTitle}
          </button>
        </Link>
      ) : (
        <button
          className="ui button"
          type="button"
          onClick={() => onClickHandler(-1)}
        >
          <i aria-hidden="true" className="" />
          {props.prevTitle}
        </button>
      )}

      <button
        className="ui button"
        type="button"
        onClick={() => onClickHandler(1)}
      >
        <i aria-hidden="true" className="" />
        {props.nextTitle}
      </button>
    </React.Fragment>
  );
};

export default PageButtons;
