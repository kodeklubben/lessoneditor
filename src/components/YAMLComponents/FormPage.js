import React from "react";
import YAMLformPage from "./YAMLformpage";
import YMLformPage from "./YMLfilePage";
import PageButtons from "../PageButtons";

const FormPage = props => {
  return (
    <div className="ui container">
      <form className="ui small form" onSubmit={props.mySubmitHandler}>
        <YAMLformPage
          mySubmitHandler={props.mySubmitHandler}
          myChangeHandler={props.myChangeHandler}
          myCheckboxHandler={props.myCheckboxHandler}
          state={props.state}
        />
        <div style={{ marginTop: 60 }} className="ui segment">
          <YMLformPage
            mySubmitHandler={props.mySubmitHandler}
            myChangeHandler={props.myChangeHandler}
            myCheckboxHandler={props.myCheckboxHandler}
            state={props.state}
          />
        </div>
        <PageButtons
          prevTitle="Tilbake"
          nextTitle="Neste"
          prevValue="/"
          nextValue="/editor"
          mySubmitHandler={props.mySubmitHandler}
        />
      </form>
    </div>
  );
};

export default FormPage;
