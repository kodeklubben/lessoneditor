import React from "react";
import { Button, Icon, Popup } from "semantic-ui-react";

class CPButton extends React.Component {
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
      <React.Fragment>
        <Popup
          content={this.props.title + " (" + this.props.shortcutKey + ")"}
          mouseEnterDelay={250}
          mouseLeaveDelay={250}
          inverted
          disabled={this.isDisabled}
          trigger={
            this.props.icon ? (
              <Button
                onClick={() =>
                  this.props.onButtonClick(
                    this.props.bTitle,
                    this.props.output,
                    this.props.cursorIntON,
                    this.props.cursorIntOFF,
                    this.props.endOutput
                  )
                }
                className=""
              >
                <Icon name={this.props.icon} />
              </Button>
            ) : (
              <Button
                onClick={() =>
                  this.props.onButtonClick(
                    this.props.bTitle,
                    this.props.output,
                    this.props.cursorIntON,
                    this.props.cursorIntOFF,
                    this.props.endOutput
                  )
                }
                className="{this.props.cname}"
              >
                {this.props.title}
              </Button>
            )
          }
        />
      </React.Fragment>
    );
  }
}

export default CPButton;
