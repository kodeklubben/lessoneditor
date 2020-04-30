import React from "react";

class MultiInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = { inputText: "", values: [] };
    this.myRef = React.createRef();
  }

  handleChange = e => {
    this.setState({ inputText: e.target.value });
  };

  handleClick = event => {
    event.preventDefault();
    if (event.target.value) {
      this.setState({ values: [...this.state.values, event.target.value] });
      this.setState({ inputText: "" });
    }
    this.myRef.current.focus();
  };

  removeClickHandler = event => {
    event.preventDefault();
    let tempArray = this.state.values;
    let index = this.state.values.indexOf(event.target.value);
    tempArray.splice(index, 1);
    this.setState({ values: tempArray });
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
          <div style={{ margin: "0.5rem" }}>
            {this.state.values.map(element => (
              <button
                style={{ marginRight: "2rem" }}
                type="button"
                key={element}
                className="ui labeled button"
                value={element}
                onClick={event => this.removeClickHandler(event)}
              >
                <i className="x icon"></i> {element}
              </button>
            ))}
          </div>

          <input
            autoFocus
            ref={this.myRef}
            autoComplete="off"
            type="text"
            placeholder={this.props.placeholder}
            value={this.state.inputText}
            onChange={this.handleChange}
          />
          <button
            type="button"
            className="ui mini button"
            value={this.state.inputText}
            onClick={e => this.handleClick(e)}
          >
            Legge til flere
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default MultiInput;
