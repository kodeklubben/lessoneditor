import React from "react";
import YAMLformPage from "./YAMLformpage";
import YMLfilePage from "./YMLfilePage";
import PageButtons from "../PageButtons";
import { NAV_BUTTONS } from "./settingsFiles/languages/formpage_NO";

const FormPage = props => {
  return (
    <div className="ui container">
      <form className="ui form" onSubmit={props.mySubmitHandler}>
        <div className="ui container">
          <YAMLformPage
            mySubmitHandler={props.mySubmitHandler}
            myChangeHandler={props.myChangeHandler}
            myCheckboxHandler={props.myCheckboxHandler}
            state={props.state}
          />
        </div>
        <div className="ui container">
          <YMLfilePage
            mySubmitHandler={props.mySubmitHandler}
            myChangeHandler={props.myChangeHandler}
            myCheckboxHandler={props.myCheckboxHandler}
            state={props.state}
          />
        </div>
        <div className="ui container">
          <PageButtons
            prevTitle={NAV_BUTTONS.prev}
            nextTitle={NAV_BUTTONS.next}
            prevValue="/"
            nextValue="/editor"
            mySubmitHandler={props.mySubmitHandler}
            state={props.state}
          />
        </div>
      </form>
    </div>
  );
};

export default FormPage;
