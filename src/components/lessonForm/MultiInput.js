import React from "react";

class MultiInput extends React.Component {
  constructor(props) {
    super(props);

    this.myRef = React.createRef();
  }

  handleClick = event => {
    if (this.props.inputValue) {
      let i = event.target.name + "List";
      let temp = { [i]: [...this.props.inputArray, this.props.inputValue] };
      this.props.multiInputHandler(temp, event.target.name);
    }
    this.myRef.current.focus();
  };

  removeClickHandler = (name, value) => {
    let i = name + "List";
    let tempArray = this.props.inputArray;
    let index = this.props.inputArray.indexOf(value);
    tempArray.splice(index, 1);
    let temp = { [i]: tempArray };
    this.props.multiInputHandler(temp, name);
    this.myRef.current.focus();
  };

  render() {
    return (
      <React.Fragment>
        <div style={{ marginBottom: "1rem" }} className="row">
          <h3 className="formLabel">
            {this.props.title}
            <span className="requiredText"> {this.props.required}</span>
          </h3>

          {this.props.autofocus ? (
            <input
              autoFocus
              ref={this.myRef}
              autoComplete="off"
              type="text"
              name={this.props.name}
              placeholder={this.props.placeholder}
              value={this.props.inputValue}
              onChange={this.props.changeHandler}
            />
          ) : (
            <input
              ref={this.myRef}
              autoComplete="off"
              type="text"
              name={this.props.name}
              placeholder={this.props.placeholder}
              value={this.props.inputValue}
              onChange={this.props.changeHandler}
            />
          )}
          <div style={{ margin: "0.5rem" }}>
            {this.props.inputArray.map(element => (
              <button
                style={{ marginRight: "1rem" }}
                type="button"
                key={element}
                onClick={() =>
                  this.removeClickHandler(this.props.name, element)
                }
              >
                <i className="x icon"></i> {element}
              </button>
            ))}
          </div>
          {this.props.validateMessage ? (
            <div className="validateError">{this.props.validateMessage}</div>
          ) : this.props.inputValue || this.props.inputArray.length > 0 ? (
            <button
              name={this.props.name}
              type="button"
              className="ui mini button"
              onClick={e => this.handleClick(e)}
            >
              Legge til flere?
            </button>
          ) : (
            ""
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default MultiInput;
