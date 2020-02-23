import React from "react";
import YMLtagsTopic from "./YMLtagsTopic";
import YMLtagsSubject from "./YMLtagsSubject";
import YMLtagsGrade from "./YMLtagsGrade";

class YMLfilePage extends React.Component {
  render() {
    return (
      <div>
        <div className="field">
          <label>
            <h3>Nivå:</h3>
            <select name="level" onChange={this.props.myChangeHandler} required>
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
      </div>
    );
  }
}

export default YMLfilePage;
