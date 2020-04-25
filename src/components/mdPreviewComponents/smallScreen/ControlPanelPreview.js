import {
  emphasis,
  undoRedo,
  saveLoadNew,
  image,
  lists,
  sections,
  code
} from "../settingsFiles/buttonConfig.js";
import React from "react";
import Buttons from "../Buttons";
import { Icon, Button, Dropdown, Divider } from "semantic-ui-react";

class ControlPanel extends React.Component {
  onButtonClick = () => {
    this.props.returnPreview();
  };

  render() {
    return (
      <div className="ui segment grid ">
        <div />
        <div className="ui icon buttons buttonBorderSmall">
          <Button labelPosition="left" onClick={this.onButtonClick}>
            <Icon name="eye" />
          </Button>
        </div>
      </div>
    );
  }
}

export default ControlPanel;