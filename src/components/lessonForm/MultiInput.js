import React from "react";

class MultiInput extends React.Component {
  constructor(props) {
    super(props);

    this.inputOrder = 1;
  }

  handleClick = event => {
    if (
      this.props.inputValue &&
      !this.props.inputArray.includes(this.props.inputValue)
    ) {
      let i = event.target.name + "List";
      let temp = { [i]: [...this.props.inputArray, this.props.inputValue] };
      this.props.multiInputHandler(temp, event.target.name);
      this.inputOrder += 1;
      this.removeNameButtonOrder += 1;

      this.textInput.focus();
    }
  };

  onBlur = e => {
    this.handleClick(e);
  };

  removeClickHandler = (name, value) => {
    let i = name + "List";
    let tempArray = this.props.inputArray;
    let index = this.props.inputArray.indexOf(value);
    tempArray.splice(index, 1);
    let temp = { [i]: tempArray };
    this.props.multiInputHandler(temp, name);

    this.inputOrder -= 1;
    this.removeNameButtonOrder -= 1;
  };

  render() {
    return (
      <React.Fragment>
        <div id="multiInputContainer" className="row">
          <h3 className="formLabel">
            {this.props.title}
            <span className="requiredText"> {this.props.required}</span>
          </h3>
          <div className="inputField">
            <div
              style={{
                order: this.inputOrder,
                width: "100%"
              }}
            >
              {this.props.autofocus ? (
                <input
                  autoFocus
                  ref={element => (this.textInput = element)}
                  id="formInput"
                  autoComplete="off"
                  type="text"
                  name={this.props.name}
                  placeholder={this.props.placeholder}
                  value={this.props.inputValue}
                  onChange={this.props.changeHandler}
                  onKeyUp={e => (e.key === "Enter" ? this.handleClick(e) : "")}
                  onBlur={e => this.onBlur(e)}
                />
              ) : (
                <input
                  ref={element => (this.textInput = element)}
                  id="formInput"
                  autoComplete="off"
                  type="text"
                  name={this.props.name}
                  placeholder={this.props.placeholder}
                  value={this.props.inputValue}
                  onChange={this.props.changeHandler}
                  onKeyUp={e => (e.key === "Enter" ? this.handleClick(e) : "")}
                  onBlur={e => this.onBlur(e)}
                />
              )}
            </div>

            {this.props.inputArray.map(element => (
              <button
                className="ui right icon button"
                style={{ order: this.inputOrder - 1 }}
                id="removeNameButton"
                type="button"
                key={element}
                onClick={() =>
                  this.removeClickHandler(this.props.name, element)
                }
              >
                <span>
                  {element + " "} <i className="x icon"></i>
                </span>
              </button>
            ))}

            <button
              style={{ order: this.inputOrder + 1 }}
              icon
              id="addNameButton"
              className="ui icon button"
              name={this.props.name}
              type="button"
              onClick={this.handleClick}
            >
              <i id="addNameButtonChild" className="plus icon" />
            </button>
          </div>
          {this.props.validateMessage ? (
            <div className="validateError">{this.props.validateMessage}</div>
          ) : (
            ""
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default MultiInput;
