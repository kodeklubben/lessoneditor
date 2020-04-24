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

  return (
    <div className="ui grid ">
      <div className="row">
        <div className="right floated three wide column">
          <div style={{ marginBottom: "-35px" }} className="ui avatar image">
            {props.imageUrl ? (
              <img src={props.imageUrl} alt="useImage"></img>
            ) : (
              <i className="user icon"></i>
            )}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="sixteen wide centered column">{renderFormPage()}</div>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    firstName: state.auth.firstName,
    imageUrl: state.auth.imageUrl,
    email: state.auth.email
  };
};

export default connect(mapStateToProps)(FormPage);
