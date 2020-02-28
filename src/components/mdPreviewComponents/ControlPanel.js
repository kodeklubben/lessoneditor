import React from "react";
import Button from "./Button";

const temp = "```";

const buttonConfig = [
  {
    bTitle: "bold",
    icon: "bold",
    output: "****",
    title: "",
    cursorIntON: 2,
    cursorIntOFF: 2,
    endOutput: ""
  },
  {
    bTitle: "italic",
    icon: "italic",
    output: "__ ",
    title: "",
    cursorIntON: 2,
    cursorIntOFF: 2,
    endOutput: ""
  },
  {
    bTitle: "undo",
    icon: "undo",
    output: "",
    title: "undo",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: ""
  },
  {
    bTitle: "redo",
    icon: "redo",
    output: "",
    title: "redo",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: ""
  },
  {
    bTitle: "load",
    icon: "upload",
    output: "",
    title: "Load",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: ""
  },
  {
    bTitle: "save",
    icon: "save",
    output: "",
    title: "Save",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: ""
  },
  {
    bTitle: "activity",
    icon: "",
    output: "{.activity}",
    title: "Steg",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "\n"
  },
  {
    bTitle: "intro",
    icon: "",
    output: "{.intro}",
    title: "Intro",
    cursorIntON: 0,
    cursorIntOFF: 0,
    endOutput: "\n"
  },
  {
    bTitle: "inline",
    icon: "",
    output: "``",
    title: "Inline Code",
    cursorIntON: 1,
    cursorIntOFF: 1,
    endOutput: ""
  },
  {
    bTitle: "codeblock",
    icon: "",
    output: `${temp}\n\n${temp}`,
    title: "Codeblock",
    cursorIntON: 4,
    endOutput: "\n"
  }
];

class ControlPanel extends React.Component {
  handleButtonClick = (value, cursorIntON, cursorIntOFF, bTitle, endOutput) => {
    this.props.handleButtonClick(
      value,
      cursorIntON,
      cursorIntOFF,
      bTitle,
      endOutput
    );
  };

  render() {
    return (
      <div className="Buttons">
        <div className="ui segment six column grid">
          {buttonConfig.map(element => (
            <div key={element.bTitle} className="column">
              <Button
                bTitle={element.bTitle}
                icon={element.icon}
                output={element.output}
                title={element.title}
                cursorIntON={element.cursorIntON}
                cursorIntOFF={element.cursorIntOFF}
                endOutput={element.endOutput}
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
