import React from "react";

class Checkbox extends React.Component {
  onInputChange = event => {
    this.props.onCheck(event);
  };

  render() {
    return (
      <div className="ui checkbox">
        <input
          type="checkbox"
          name={this.props.subtag}
          id={this.props.value}
          value={this.props.value}
          onChange={this.onInputChange}
        />
        <label style={{ cursor: "pointer" }} htmlFor={this.props.value}>
          {this.props.name}
        </label>
      </div>
    );
  }
}

export default Checkbox;
