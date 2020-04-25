import React from "react";
import { Button, Icon, Popup } from "semantic-ui-react";

class CPButton extends React.Component {
  state = { isOpen: false };

  smallScreen = false;

  componentDidUpdate() {
    if (
      window.innerWidth < 700 ||
      window.innerHeight / window.innerWidth > 1.4
    ) {
      this.smallScreen = true;
    } else {
      this.smallScreen = false;
    }
  }

  handleButtonPress = () => {
    this.buttonPressTimer = setTimeout(
      () => this.setState({ isOpen: true }),
      500
    );
  };

  handleOpen = () => {
    this.timeout = setTimeout(() => {
      this.setState({ isOpen: false });
    }, 1500);
  };

  handleClose = () => {
    this.setState({ isOpen: false });
    clearTimeout(this.timeout);
    clearTimeout(this.buttonPressTimer);
  };

  responsiveCP = () => {
    return this.smallScreen ? (
      <React.Fragment>
        <Popup
          content={this.props.title + " (" + this.props.shortcutKey + ")"}
          mouseEnterDelay={250}
          mouseLeaveDelay={250}
          inverted
          basic
          size="tiny"
          position="bottom center"
          open={this.state.isOpen}
          onOpen={this.handleOpen}
          onClose={this.handleClose}
          trigger={
            this.props.icon ? (
              <Button
                onTouchStart={this.handleButtonPress}
                onTouchEnd={this.handleButtonRelease}
                onMouseDown={this.handleButtonPress}
                onClick={() =>
                  this.props.onButtonClick(
                    this.props.bTitle,
                    this.props.output,
                    this.props.cursorIntON,
                    this.props.cursorIntOFF,
                    this.props.endOutput
                  )
                }
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
              >
                {this.props.title}
              </Button>
            )
          }
        />
      </React.Fragment>
    ) : (
      <React.Fragment>
        <Popup
          content={this.props.title + " (" + this.props.shortcutKey + ")"}
          mouseEnterDelay={250}
          mouseLeaveDelay={250}
          inverted
          basic
          size="tiny"
          position="bottom center"
          trigger={
            this.props.icon ? (
              <Button
                onTouchStart={this.handleButtonPress}
                onTouchEnd={this.handleButtonRelease}
                onMouseDown={this.handleButtonPress}
                onClick={() =>
                  this.props.onButtonClick(
                    this.props.bTitle,
                    this.props.output,
                    this.props.cursorIntON,
                    this.props.cursorIntOFF,
                    this.props.endOutput
                  )
                }
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
              >
                {this.props.title}
              </Button>
            )
          }
        />
      </React.Fragment>
    );
  };

  render() {
    return this.responsiveCP();
  }
}

export default CPButton;
