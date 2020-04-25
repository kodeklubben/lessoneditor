import React from "react";
import { connect } from "react-redux";
import Buttons from "./Button";
import { Link, Redirect } from "react-router-dom";
import { Icon, Button, Dropdown, Divider } from "semantic-ui-react";
import {
  emphasis,
  undoRedo,
  saveLoadNew,
  image,
  lists,
  sections,
  code
} from "../settingsFiles/buttonConfig.js";

class ControlPanel extends React.Component {
  handleButtonClick = (
    bTitle,
    output,
    cursorIntON,
    cursorIntOFF,
    endOutput
  ) => {
    this.props.handleButtonClick(
      bTitle,
      output,
      cursorIntON,
      cursorIntOFF,
      endOutput
    );
  };

  onButtonClick = () => {
    this.props.returnPreview();
  };

  render() {
    if (this.props.state.redirect) {
      return <Redirect to={this.props.state.redirect} />;
    }
    return (
      <div className="ui ten column grid">
        <div className="ui icon buttons column">
          <Button
            icon="eye"
            labelPosition="left"
            onClick={this.onButtonClick}
          />
        </div>

        {undoRedo.map(element => (
          <div className="ui icon buttons column">
            <Buttons
              bTitle={element.bTitle}
              icon={element.icon}
              output={element.output}
              title={element.title}
              cursorIntON={element.cursorIntON}
              cursorIntOFF={element.cursorIntOFF}
              endOutput={element.endOutput}
              onButtonClick={this.handleButtonClick}
              shortcutKey={element.shortcut}
            />
          </div>
        ))}

        <div className="ui icon buttons column">
          <Buttons
            bTitle={image[0].bTitle}
            icon={image[0].icon}
            output={image[0].output}
            title={image[0].title}
            cursorIntON={image[0].cursorIntON}
            cursorIntOFF={image[0].cursorIntOFF}
            endOutput={image[0].endOutput}
            onButtonClick={this.handleButtonClick}
            shortcutKey={image[0].shortcut}
          />
        </div>

        <div className="column">
          <div className="ui avatar image">
            {this.props.imageUrl ? (
              <img src={this.props.imageUrl} alt="useImage"></img>
            ) : (
              <i className="user icon"></i>
            )}
          </div>
        </div>
        <div className="right floated column">
          <button
            className="ui icon right button"
            type="button"
            onClick={this.props.mySubmitHandler}
          >
            <i aria-hidden="true" className="right arrow icon" />
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    imageUrl: state.auth.imageUrl
  };
};

export default connect(mapStateToProps)(ControlPanel);
