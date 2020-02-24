import React from "react";
import { Icon } from "semantic-ui-react";

class Button extends React.Component {
  onButtonClick = event => {
    var test = " ";

    this.props.onButtonClickHandler(this.props.output);
    if (this.test === " ") {
      this.test = "inverted";
    } else {
      this.test = " ";
    }
  };

  render() {
    return (
      <div onClick={this.onButtonClick}>
        {console.log(`${this.props.icon} ${this.props.test} icon`)}
        <i className={`${this.props.icon} icon`} />
      </div>
    );
  }
}

export default Button;
