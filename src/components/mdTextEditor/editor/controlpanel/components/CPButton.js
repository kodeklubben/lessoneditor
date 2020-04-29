import React from "react";
import { Button, Icon, Popup } from "semantic-ui-react";

class Buttons extends React.Component {
  state = { isOpen: false };

  smallScreen = false;

  componentDidUpdate() {
    if (
      window.innerWidth < 600 ||
      window.innerHeight / window.innerWidth > 1.4
    ) {
      this.smallScreen = true;
    } else if (
      window.innerWidth > 600 ||
      window.innerHeight / window.innerWidth < 1.4
    ) {
      this.smallScreen = false;
    }
  }

  handleButtonPress = () => {
    this.buttonPressTimer = setTimeout(
      () => this.setState({ isOpen: true }),
      500
    );
    this.buttonPressTimer2 = setTimeout(() => {
      this.handleOpen();
    }, 500);
  };

  handleOpen = () => {
    this.timeout = setTimeout(() => {
      this.setState({ isOpen: false });
    }, 2000);
  };

  handleClose = () => {
    clearTimeout(this.buttonPressTimer);
    clearTimeout(this.buttonPressTimer2);
  };

  responsiveCP = () => {
    return this.smallScreen ? (
      <React.Fragment>
        <Popup
          content={this.props.title}
          inverted
          basic
          size="tiny"
          style={{}}
          open={this.state.isOpen}
          onOpen={this.handleOpen}
          onClose={this.handleClose}
          trigger={
            this.props.icon ? (
              <Button
                style={{ backgroundColor: "#b1daae" }}
                onTouchStart={this.handleButtonPress}
                onTouchEnd={this.handleClose}
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
                style={{ backgroundColor: "#b1daae" }}
                onTouchStart={this.handleButtonPress}
                onTouchEnd={this.handleClose}
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
          trigger={
            this.props.icon ? (
              <Button
                style={{ backgroundColor: "#b1daae" }}
                onTouchStart={this.handleButtonPress}
                onTouchEnd={this.handleButtonRelease}
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
                style={{ backgroundColor: "#b1daae" }}
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

export default Buttons;
