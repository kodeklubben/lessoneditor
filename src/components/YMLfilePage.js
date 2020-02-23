import React from "react";
import YMLtagsTopic from "./YMLtagsTopic";
import YMLtagsSubject from "./YMLtagsSubject";
import YMLtagsGrade from "./YMLtagsGrade";

class YMLfilePage extends React.Component {
  constructor(props) {
    super(props);
  }
  /* constructor(props) {
    super(props);
    this.state = {
      level: 1,
      license: "",
      tags: { topic: [], subject: [], grade: [] }
    };
  }

  myChangeHandler = event => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  };

  mySubmitHandler = event => {
    event.preventDefault();
    this.props.onSubmit(this.state);
  };

  myCheckboxHandler = event => {
    let name = event.target.name;
    let value = event.target.value;

    let i = this.state.tags;
    if (i[name].includes(value)) {
      i[name].splice(i[name].indexOf(value), 1);
    } else {
      i[name].push(value);
    }
    this.setState({ tags: i });
  }; */

  render() {
    return (
      <div className="ui container">
        <form className="ui big form" onSubmit={this.props.mySubmitHandler}>
          <div className="field">
            <label>
              <h3>Nivå:</h3>
              <select
                name="level"
                onChange={this.props.myChangeHandler}
                required
              >
                <option value={1}>Introduksjon</option>
                <option value={2}>Nybegynner</option>
                <option value={3}>Erfaren</option>
                <option value={4}>Ekspert</option>
              </select>
            </label>
          </div>
          <div className="field">
            <label>
              <h3>Lisens:</h3>
              <input
                type="text"
                name="license"
                placeholder="Lisens"
                value={this.props.state.license}
                onChange={this.props.myChangeHandler}
              />
            </label>
          </div>

          <h3>Tema:</h3>
          <YMLtagsTopic myCheckboxHandler={this.props.myCheckboxHandler} />

          <br />
          <h3>Fag:</h3>
          <YMLtagsSubject myCheckboxHandler={this.props.myCheckboxHandler} />

          <br />
          <h3>Klassetrinn: </h3>
          <YMLtagsGrade myCheckboxHandler={this.props.myCheckboxHandler} />

          <div className="buttons">
            <button className="ui icon left labeled black button" type="button">
              <i aria-hidden="true" className="left arrow icon"></i>
              Tilbake
            </button>
            <button
              className="ui icon right labeled button toRight"
              type="button"
              onClick={this.props.mySubmitHandler}
            >
              Neste
              <i aria-hidden="true" className="right arrow icon"></i>
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default YMLfilePage;
