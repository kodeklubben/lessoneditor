import React from "react";
import Button from "./Button";

const temp = "```";

const buttonConfig = [
  {
    bTitle: "bold",
    icon: "bold",
    output: "****",
    title: "",
    cursorInt: 2
  },
  {
    bTitle: "italic",
    icon: "italic",
    output: " __",
    title: "",
    cursorInt: 1
  },
  {
    bTitle: "activity",
    icon: "",
    output: "{.activity}",
    title: "Steg",
    cursorInt: -11
  },
  {
    bTitle: "intro",
    icon: "",
    output: "{.intro}",
    title: "Intro",
    cursorInt: -8
  },
  {
    bTitle: "inline",
    icon: "",
    output: "``",
    title: "Inline Code",
    cursorInt: 1
  },
  {
    bTitle: "codeblock",
    icon: "",
    output: `${temp}\n\n${temp}`,
    title: "Codeblock",
    cursorInt: 4
  }
];

class ControlPanel extends React.Component {
  handleButtonClick = (value, cursorInt, bTitle) => {
    this.props.handleButtonClick(value, cursorInt, bTitle);
  };

  render() {
    console.log({ ...buttonConfig[0], icon: "Hei" });
    return (
      <div className="Buttons">
        <div className="ui segment six column grid">
          {buttonConfig.map(element => (
            <div key={element.output} className="column">
              <Button
                bTitle={element.bTitle}
                icon={element.icon}
                output={element.output}
                title={element.title}
                cursorInt={element.cursorInt}
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
