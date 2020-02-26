import React from "react";

class Button extends React.Component {
  render() {
    return (
      <div
        onClick={() =>
          this.props.onButtonClick(
            this.props.output,
            this.props.cursorInt,
            this.props.bTitle
          )
        }
      >
        <button>
          {this.props.title}
          <i className={`${this.props.icon} ${this.test} icon`} />
        </button>
      </div>
    );
  }
}

export default Button;
