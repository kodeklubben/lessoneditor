import React from "react";

class Checkbox extends React.Component {
  onInputChange = event => {
    this.props.onCheck(event);
  };

  render() {
    return (
      <div>
        <input
          type="checkbox"
          name={this.props.subtag}
          id={this.props.value}
          value={this.props.value}
          onChange={this.onInputChange}
        ></input>
        <label htmlFor={this.props.subtag}> {this.props.name} </label>
      </div>
    );
  }
}

export default Checkbox;
