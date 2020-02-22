import React from "react";
import Checkbox from "./Checkbox";

class YMLtagsTopic extends React.Component {
  render() {
    return (
      <div className="topicBox">
        <div className="ui equal width grid">
          <div className="column">
            <Checkbox
              name="Animasjon"
              value="animation"
              subtag="topic"
              onCheck={this.props.myCheckboxHandler}
            />
            <Checkbox
              name="App"
              value="app"
              subtag="topic"
              onCheck={this.props.myCheckboxHandler}
            />
            <Checkbox
              name="Blokkbasert"
              value="block_based"
              subtag="topic"
              onCheck={this.props.myCheckboxHandler}
            />
            <Checkbox
              name="Elektronikk"
              value="electronics"
              subtag="topic"
              onCheck={this.props.myCheckboxHandler}
            />
          </div>
          <div className="column">
            <Checkbox
              name="Kryptografi"
              value="cryptography"
              subtag="topic"
              onCheck={this.props.myCheckboxHandler}
            />
            <Checkbox
              name="Lyd"
              value="sound"
              subtag="topic"
              onCheck={this.props.myCheckboxHandler}
            />
            <Checkbox
              name="Minecraft"
              value="minecraft"
              subtag="topic"
              onCheck={this.props.myCheckboxHandler}
            />
            <Checkbox
              name="Nettside"
              value="web"
              subtag="topic"
              onCheck={this.props.myCheckboxHandler}
            />
          </div>
          <div className="column">
            <Checkbox
              name="Robot"
              value="robot"
              subtag="topic"
              onCheck={this.props.myCheckboxHandler}
            />
            <Checkbox
              name="Spill"
              value="game"
              subtag="topic"
              onCheck={this.props.myCheckboxHandler}
            />
            <Checkbox
              name="Stegbasert"
              value="step_based"
              subtag="topic"
              onCheck={this.props.myCheckboxHandler}
            />
            <Checkbox
              name="Tekstbasert"
              value="text_based"
              subtag="topic"
              onCheck={this.props.myCheckboxHandler}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default YMLtagsTopic;
