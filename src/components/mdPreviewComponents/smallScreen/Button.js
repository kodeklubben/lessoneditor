import React from "react";
import { Button, Icon } from "semantic-ui-react";

class Buttons extends React.Component {
  render() {
    return (
      <React.Fragment>
        {this.props.icon ? (
          <Button
            icon={this.props.icon}
            className=""
            labelPosition="left"
            onClick={() =>
              this.props.onButtonClick(
                this.props.bTitle,
                this.props.output,
                this.props.cursorIntON,
                this.props.cursorIntOFF,
                this.props.endOutput
              )
            }
          />
        ) : (
          <Button className={this.props.cname} labelPosition="left">
            {this.props.title}
          </Button>
        )}
      </React.Fragment>
    );
  }
}

export default Buttons;
