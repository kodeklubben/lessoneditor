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
          content={this.props.title + " (ctrl+" + this.props.shortcutKey + ")"}
          mouseEnterDelay={250}
          mouseLeaveDelay={250}
          inverted
          trigger={
            this.props.icon ? (
              <Button className={this.props.cname} labelPosition="left">
                <Icon name={this.props.icon} />
              </Button>
            ) : (
              <Button className={this.props.cname} labelPosition="left">
                {this.props.title}
              </Button>
            )
          }
        />
      </div>
    );
  }
}

export default Buttons;
