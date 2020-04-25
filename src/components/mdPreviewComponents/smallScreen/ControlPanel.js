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
      <div className="ui segment grid buttonBorderSmall">
        <div />
        <div className="ui icon buttons">
          <Button labelPosition="left" onClick={this.onButtonClick}>
            <Icon name="eye" />
          </Button>
        </div>
        <div />
        {undoRedo.map(element => (
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
        ))}
        <div />

        <div className="ui icon buttons">
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

        <div
          style={{ marginTop: "11px", marginBottom: "-11px" }}
          className="right floated three wide column"
        >
          <div className="ui avatar image">
            {this.props.imageUrl ? (
              <img src={this.props.imageUrl} alt="useImage"></img>
            ) : (
              <i className="user icon"></i>
            )}
          </div>
        </div>

        <button
          style={{ marginRight: "-30px" }}
          className="ui right floated icon right  column button floatRight"
          type="button"
          onClick={this.props.mySubmitHandler}
        >
          <i aria-hidden="true" className="right arrow icon" />
        </button>
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
