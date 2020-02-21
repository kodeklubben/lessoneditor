import React from "react";
import Checkbox from "./Checkbox";

class YMLfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      level: 1,
      license: "",
      tags: []
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

  myCheckboxHandler = value => {
    console.log(value);
    let i = this.state.tags;
    console.log(i);
    if (i.includes(value)) {
      i.splice(i.indexOf(value), 1);
    } else {
      i.push(value);
    }
    this.setState({ tags: i });
  };

  render() {
    return (
      <div className="ui container">
        <form className="ui big form" onSubmit={this.mySubmitHandler}>
          <div className="field">
            <label>
              Nivå:
              <select name="level" onChange={this.myChangeHandler}>
                <option value={1}>Introduksjon</option>
                <option value={2}>Nybegynner</option>
                <option value={3}>Erfaren</option>
                <option value={4}>Ekspert</option>
              </select>
            </label>
          </div>
          <div className="field">
            <label>
              Lisens:
              <input
                type="text"
                name="license"
                placeholder="Lisens"
                value={this.state.license}
                onChange={this.myChangeHandler}
              />
            </label>
          </div>
          <label>
            Tags:
            <div className="ui equal width grid">
              <div className="column">
                <Checkbox name="Animasjon" onCheck={this.myCheckboxHandler} />
                <Checkbox name="App" onCheck={this.myCheckboxHandler} />
                <Checkbox name="Blokkbasert" onCheck={this.myCheckboxHandler} />
                <Checkbox name="Elektronikk" onCheck={this.myCheckboxHandler} />
              </div>
              <div className="column">
                <Checkbox name="Kryptografi" onCheck={this.myCheckboxHandler} />
                <Checkbox name="Lyd" onCheck={this.myCheckboxHandler} />
                <Checkbox name="Minecraft" onCheck={this.myCheckboxHandler} />
                <Checkbox name="Nettside" onCheck={this.myCheckboxHandler} />
              </div>
              <div className="column">
                <Checkbox name="Robot" onCheck={this.myCheckboxHandler} />
                <Checkbox name="Spill" onCheck={this.myCheckboxHandler} />
                <Checkbox name="Stegbasert" onCheck={this.myCheckboxHandler} />
                <Checkbox name="Tekstbasert" onCheck={this.myCheckboxHandler} />
              </div>
            </div>
          </label>

          <button className="ui secondary button" type="button">
            Tilbake
          </button>
          <input
            className="ui primary button toRight"
            type="submit"
            value="Neste"
          />
        </form>
      </div>
    );
  }
}

export default YMLfilePage;
