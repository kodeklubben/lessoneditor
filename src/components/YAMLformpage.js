import React from "react";

class YAMLformpage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="field">
          <label>
            Tema:
            <select
              name="course"
              onChange={this.props.myChangeHandler}
              required
            >
              <option value="Micro:it">Micro:it</option>
              <option value="Scratch">Scratch</option>
              <option value="Python">Python</option>
              <option value="Lego Mindstorms">Lego Mindstorms</option>
              <option value="Web">Web</option>
              <option value="Code Studio">Code Studio</option>
              <option value="Processing">Processing</option>
              <option value="Elm">Elm</option>
              <option value="Computer Craft">Computer Craft</option>
              <option value="App Inventor">App Inventor</option>
              <option value="Arduino">Arduino</option>
            </select>
          </label>
        </div>
        <div className="field">
          <label>
            Tittel:
            <input
              type="text"
              name="title"
              placeholder="Tittel"
              value={this.props.state.title}
              onChange={this.props.myChangeHandler}
              required
            />
          </label>
        </div>
        <div className="field">
          <label>
            Forfatter:
            <input
              type="text"
              name="author"
              placeholder="Navn"
              value={this.props.state.author}
              onChange={this.props.myChangeHandler}
              required
            />
          </label>
        </div>
        <div className="field">
          <label>
            Oversatt av:
            <input
              type="text"
              name="translator"
              placeholder="Navn"
              value={this.props.state.translator}
              onChange={this.props.myChangeHandler}
            />
          </label>
        </div>
        <div className="field">
          <label>
            Språk:
            <select
              name="language"
              onChange={this.props.myChangeHandler}
              required
            >
              <option value="nb">Norsk</option>
              <option value="nn">Nynorsk</option>
              <option value="en">Engelsk</option>
              <option value="is">Islandsk</option>
              {/* <option value="sv">Svensk</option>
                <option value="da">Dansk</option>
                <option value="hr">Kroatisk</option> */}
            </select>
          </label>
        </div>
      </div>
    );
  }
}

export default YAMLformpage;
