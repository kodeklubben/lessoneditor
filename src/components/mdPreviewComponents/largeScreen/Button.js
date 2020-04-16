import React from "react";
import { Button, Icon, Popup } from "semantic-ui-react";

class Buttons extends React.Component {
  isDisabled = false;

  componentDidUpdate() {
    if (window.innerWidth < 700) {
      this.isDisabled = true;
    } else {
      this.isDisabled = false;
    }
  }

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
          content={this.props.title + " (" + this.props.shortcutKey + ")"}
          mouseEnterDelay={250}
          mouseLeaveDelay={250}
          inverted
          disabled={this.isDisabled}
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
