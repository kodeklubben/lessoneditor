import React, { useContext } from "react";
import Page1 from "./Page1";
import Page2 from "./Page2";
import Page3 from "./Page3";
import PageButtons from "../PageButtons";
import ProfileMenu from "../ProfileMenu";
import { NAV_BUTTONS } from "./settingsFiles/languages/formpage_NO";
import { UserContext } from "../UserContext";

const FormPage = (props) => {
  const renderFormPage = () => {
    if (props.state.pageNumber === 1) {
      return (
        <div>
          <div className="ui segment formColor">
            <Page1
              changeHandler={props.changeHandler}
              multiInputHandler={props.multiInputHandler}
              state={props.state}
            />
          </div>
          <PageButtons
            prevTitle={NAV_BUTTONS.prev}
            nextTitle={NAV_BUTTONS.next}
            setPageNumber={props.setPageNumber}
            err="author"
            setErr={props.setErr}
            state={props.state}
          />
        </div>
      );
    } else if (props.state.pageNumber === 2) {
      return (
        <div>
          <div className="ui segment formColor">
            <Page2
              changeHandler={props.changeHandler}
              checkboxHandler={props.checkboxHandler}
              state={props.state}
            />
          </div>
          <PageButtons
            prevTitle={NAV_BUTTONS.prev}
            nextTitle={NAV_BUTTONS.next}
            setPageNumber={props.setPageNumber}
            setErr={props.setErr}
            state={props.state}
          />
        </div>
      );
    } else if (props.state.pageNumber === 3) {
      return (
        <div>
          <div className="ui segment formColor">
            <Page3
              changeHandler={props.changeHandler}
              checkboxHandler={props.checkboxHandler}
              selectDropdownHandler={props.selectDropdownHandler}
              state={props.state}
            />
          </div>

          <PageButtons
            prevTitle={NAV_BUTTONS.prev}
            nextTitle={NAV_BUTTONS.next}
            submitHandler={props.submitHandler}
            setPageNumber={props.setPageNumber}
            err="title"
            setErr={props.setErr}
            state={props.state}
          />
        </div>
      );
    }
  };
  const user = useContext(UserContext);
  return (
    <div id="formPage" className="ui grid">
      <div className="right aligned row">
        <div id="profileMenu" className="right floated three wide column">
          <ProfileMenu name={user.name} email={user.email} />
        </div>
        <div className="column" />
      </div>
      <div className="row">
        <div className="fourteen wide centered column">{renderFormPage()}</div>
      </div>
    </div>
  );
};

export default FormPage;
