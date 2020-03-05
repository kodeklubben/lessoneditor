import React from "react";
import YAMLformPage from "./YAMLformpage";
import YMLformPage from "./YMLfilePage";
import PageButtons from "../PageButtons";

const FormPage = props => {
  return (
    <div className="ui segment">
      <div className="ui container">
        <form className="ui small form" onSubmit={props.mySubmitHandler}>
          <YAMLformPage
            mySubmitHandler={props.mySubmitHandler}
            myChangeHandler={props.myChangeHandler}
            myCheckboxHandler={props.myCheckboxHandler}
            state={props.state}
          />
          <div className="ui container">
            <YMLformPage
              mySubmitHandler={props.mySubmitHandler}
              myChangeHandler={props.myChangeHandler}
              myCheckboxHandler={props.myCheckboxHandler}
              state={props.state}
            />
          </div>
          <div className="ui formbutton container">
            <PageButtons
              prevTitle="Tilbake"
              nextTitle="Neste"
              prevValue="/"
              nextValue="/editor"
              mySubmitHandler={props.mySubmitHandler}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormPage;
