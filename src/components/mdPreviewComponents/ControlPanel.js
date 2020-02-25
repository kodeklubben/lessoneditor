import React from "react";
import Button from "./Button";

const temp = "```";

class ControlPanel extends React.Component {
  handleButtonClick = value => {
    this.props.handleButtonClick(value);
  };

  render() {
    return (
      <div className="Buttons">
        <div className="ui segment six column grid">
          <div className="column">
            <Button
              icon="bold"
              output=" **bold text here** "
              title=""
              onButtonClick={this.handleButtonClick}
            />
          </div>
          <div className="column">
            <Button
              icon="italic"
              output=" _italic text here_ "
              title=""
              onButtonClick={this.handleButtonClick}
            />
          </div>
          <div className="column">
            <Button
              icon=""
              output=" {.activity} "
              title="Steg"
              onButtonClick={this.handleButtonClick}
            />
          </div>
          <div className="column">
            <Button
              icon=""
              output=" {.intro} "
              title="Intro"
              onButtonClick={this.handleButtonClick}
            />
          </div>
          <div className="column">
            <Button
              icon=""
              output=" `inline code here` "
              title="Inline Kode"
              onButtonClick={this.handleButtonClick}
            />
          </div>
          <div className="column">
            <Button
              icon=""
              output={`${temp}\ncodeblock\n${temp}`}
              title="Code Block Kode"
              onButtonClick={this.handleButtonClick}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ControlPanel;
