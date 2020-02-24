import React from "react";
import { Icon } from "semantic-ui-react";

class Button extends React.Component {
  onButtonClick = event => {
    this.props.onButtonClickHandler(this.props.output);
  };

  render() {
    return (
      <div onClick={this.onButtonClick}>
        <i className={this.props.icon + " icon"} />
      </div>
    );
  }
}

export default Button;
