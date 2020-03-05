import React from "react";
import { Button, Icon, Popup } from "semantic-ui-react";

class Buttons extends React.Component {
  render() {
    return (
      <div
        onClick={() =>
          this.props.onButtonClick(
            this.props.output,
            this.props.cursorIntON,
            this.props.cursorIntOFF,
            this.props.bTitle,
            this.props.endOutput
          )
        }
      >
        <Popup
          content={"ctrl+" + this.props.shortcutKey}
          mouseEnterDelay={1000}
          trigger={
            this.props.title ? (
              <Button>{this.props.title}</Button>
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
