import React from "react";
import { Link, Redirect } from "react-router-dom";

const VALIDATION_ERROR = "* må fylles ut";

const PageButtons = props => {
  if (props.state.redirect) {
    return <Redirect to={props.state.redirect} />;
  }

  const validate = () => {
    let titleErr = "";
    let authorErr = "";

    if (!props.state.title) {
      titleErr = VALIDATION_ERROR;
    }
    if (!props.state.author) {
      authorErr = VALIDATION_ERROR;
    }

    if (titleErr && props.err === "title") {
      props.setErr(titleErr, "");
      return false;
    }
    if (authorErr && props.err === "author") {
      props.setErr("", authorErr);
      return false;
    }

    return true;
  };

  const onClickHandler = input => {
    let notErr = validate();

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
          <button className="ui button" type="button">
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
        type="text"
        onClick={() => onClickHandler(1)}
      >
        <i aria-hidden="true" className="" />
        {props.nextTitle}
      </button>
    </React.Fragment>
  );
};

export default PageButtons;
