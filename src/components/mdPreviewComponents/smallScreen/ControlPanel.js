import React from "react";
import { connect } from "react-redux";
import Buttons from "../Buttons";
import ProfileMenu from "../../ProfileMenu";
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
      <div className="ui segment ten column grid buttonBorderSmall">
        <div />
        <Buttons
          bTitle=""
          icon="eye"
          output=""
          title="Forhåndsvisning"
          cursorIntON=""
          cursorIntOFF=""
          endOutput=""
          onButtonClick={this.onButtonClick}
          shortcutKey=""
        />

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
          style={{ margin: "auto" }}
          className="right floated three wide column"
        >
          <ProfileMenu />
        </div>

        <button
          style={{ margin: "auto" }}
          className="ui right floated icon right  column"
          type="button"
          onClick={this.props.mySubmitHandler}
        >
          <i aria-hidden="true" className="right arrow icon" />
        </button>
        <div style={{ margin: "auto" }} />
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
