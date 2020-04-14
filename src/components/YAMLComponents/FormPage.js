import React from "react";
import YAMLformPage from "./YAMLformpage";
import YMLfilePage from "./YMLfilePage";
import PageButtons from "../PageButtons";
import { NAV_BUTTONS } from "./settingsFiles/languages/formpage_NO";

const FormPage = props => {
  return (
    <div className="">
      <div className="ui container">
        <form className="ui small form" onSubmit={props.mySubmitHandler}>
          <YAMLformPage
            mySubmitHandler={props.mySubmitHandler}
            myChangeHandler={props.myChangeHandler}
            myCheckboxHandler={props.myCheckboxHandler}
            state={props.state}
          />
          <div className="ui container">
            <YMLfilePage
              mySubmitHandler={props.mySubmitHandler}
              myChangeHandler={props.myChangeHandler}
              myCheckboxHandler={props.myCheckboxHandler}
              state={props.state}
            />
          </div>
          <div className="ui formbutton container">
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
    </div>
  );
};

export default FormPage;
