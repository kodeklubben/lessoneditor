import React from "react";

// var test = "";

class Button extends React.Component {
  onButtonClick = () => {
    this.props.onButtonClick(this.props.output);

    // if (this.test === "") {
    //   this.test = "inverted";
    // } else {
    //   this.test = "";
  };

  render() {
    return (
      <div onClick={this.onButtonClick}>
        <button>
          {this.props.title}
          {/* <i className={`${this.props.icon} ${this.test} icon`} /> <<<----   Inverter icon når presset, kanskje nyttig senere  */}
          <i className={`${this.props.icon} icon`} />
        </button>
      </div>
    );
  }
}

export default Button;
