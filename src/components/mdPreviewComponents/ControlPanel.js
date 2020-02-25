import React from "react";
import Button from "./Button";

const temp = "```";

const buttonConfig = [
  { icon: "bold", output: "**bold text here** ", title: "" },
  { icon: "italic", output: " _italic text here_ ", title: "" },
  { icon: "", output: " {.activity} ", title: "Steg" },
  { icon: "", output: " {.intro} ", title: "Intro" },
  { icon: "", output: " `inline code here` ", title: "Inline Code" },
  { icon: "", output: `${temp}\ncodeblock\n${temp}`, title: "Codeblock" }
];

class ControlPanel extends React.Component {
  handleButtonClick = value => {
    this.props.handleButtonClick(value);
  };

  render() {
    console.log({ ...buttonConfig[0], icon: "Hei" });
    return (
      <div className="Buttons">
        <div className="ui segment six column grid">
          {buttonConfig.map(element => (
            <div key={element.output} className="column">
              <Button
                icon={element.icon}
                output={element.output}
                title={element.title}
                onButtonClick={this.handleButtonClick}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default ControlPanel;
