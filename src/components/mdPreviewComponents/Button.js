import React from "react";
import { Button, Icon, Popup } from "semantic-ui-react";

class Buttons extends React.Component {
  render() {
    return (
      <div
        onClick={() =>
          this.props.onButtonClick(
            this.props.bTitle,
            this.props.output,
            this.props.cursorIntON,
            this.props.cursorIntOFF,
            this.props.endOutput
          )
        }
        className="buttonBorder"
      >
        <Popup
          content={"ctrl+" + this.props.shortcutKey}
          mouseEnterDelay={500}
          trigger={
            this.props.title ? (
              <Button labelPosition="left">
                <Icon name={this.props.icon} />
                {this.props.title}
              </Button>
            ) : (
              <Button icon={this.props.icon} />
            )
          }
        />
      </div>
    );
  }
}

export default Buttons;
