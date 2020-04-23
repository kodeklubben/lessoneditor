import React from "react";
import { connect } from "react-redux";
import Page1 from "./Page1";
import Page2 from "./Page2";
import Page3 from "./Page3";
import PageButtons from "../PageButtons";
import { NAV_BUTTONS } from "./settingsFiles/languages/formpage_NO";

const FormPage = props => {
  const renderFormPage = () => {
    if (props.state.pageNumber === 1) {
      return (
        <div className="ui segment form">
          <form className="" onSubmit={props.submitHandler}>
            <Page1 changeHandler={props.changeHandler} state={props.state} />

            <div className="">
              <PageButtons
                prevTitle={NAV_BUTTONS.prev}
                nextTitle={NAV_BUTTONS.next}
                prevValue="/"
                submitHandler={props.submitHandler}
                setPageNumber={props.setPageNumber}
                err="author"
                setErr={props.setErr}
                state={props.state}
              />
            </div>
          </form>
        </div>
      );
    } else if (props.state.pageNumber === 2) {
      return (
        <div className="ui segment form">
          <form className="" onSubmit={props.submitHandler}>
            <Page2
              changeHandler={props.changeHandler}
              checkboxHandler={props.checkboxHandler}
              state={props.state}
            />

            <div className="">
              <PageButtons
                prevTitle={NAV_BUTTONS.prev}
                nextTitle={NAV_BUTTONS.next}
                prevValue="/"
                submitHandler={props.submitHandler}
                setPageNumber={props.setPageNumber}
                err=""
                setErr={props.setErr}
                state={props.state}
              />
            </div>
          </form>
        </div>
      );
    } else if (props.state.pageNumber === 3) {
      return (
        <div className="ui segment form">
          <form className="" onSubmit={props.submitHandler}>
            <Page3
              changeHandler={props.changeHandler}
              checkboxHandler={props.checkboxHandler}
              state={props.state}
            />

            <div className="">
              <PageButtons
                prevTitle={NAV_BUTTONS.prev}
                nextTitle={NAV_BUTTONS.next}
                prevValue="/"
                submitHandler={props.submitHandler}
                setPageNumber={props.setPageNumber}
                err="title"
                setErr={props.setErr}
                state={props.state}
              />
            </div>
          </form>
        </div>
      );
    }
  };

  return props.imageUrl ? (
    <div className="column">
      <span style={{ marginRight: "6px" }}>{props.firstName}</span>
      <img
        className="ui avatar image"
        src={props.imageUrl}
        alt="useImage"
      ></img>
      {renderFormPage()}
    </div>
  ) : (
    <div className="column">
      <span style={{ marginRight: "6px" }}>{props.firstName}</span>
      <i className="user icon"></i>
      {renderFormPage()}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    firstName: state.auth.firstName,
    imageUrl: state.auth.imageUrl
  };
};

export default connect(mapStateToProps)(FormPage);
