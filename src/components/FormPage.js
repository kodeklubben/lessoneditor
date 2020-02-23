import React from "react";
import YAMLformPage from "./YAMLformpage";
import YMLformPage from "./YMLfilePage";

const FormPage = props => {
  return (
    <div className="ui container">
      <form className="ui big form" onSubmit={props.mySubmitHandler}>
        <div className="ui grid">
          <div className="eight wide column">
            <YAMLformPage
              mySubmitHandler={props.mySubmitHandler}
              myChangeHandler={props.myChangeHandler}
              myCheckboxHandler={props.myCheckboxHandler}
              state={props.state}
            />
          </div>
          <div className="eight wide column">
            <YMLformPage
              mySubmitHandler={props.mySubmitHandler}
              myChangeHandler={props.myChangeHandler}
              myCheckboxHandler={props.myCheckboxHandler}
              state={props.state}
            />
          </div>
        </div>
        <div className="buttons">
          <button className="ui icon left labeled black button" type="button">
            <i aria-hidden="true" className="left arrow icon"></i>
            Tilbake
          </button>
          <button
            className="ui icon right labeled button toRight"
            type="button"
            onClick={props.mySubmitHandler}
          >
            Neste
            <i aria-hidden="true" className="right arrow icon"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormPage;
