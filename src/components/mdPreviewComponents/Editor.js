import React from "react";
import "../../index.css";
import MDTextArea from "./MDTextArea";
import MDPreview from "./MDPreview";
import Markdown from "markdown-it";
import { mdParser } from "../../utils/mdParser";
import ControlPanel from "./ControlPanel";

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      textValue: "",
      mdValue: ""
    };
  }

  handleChange = textInput => {
    this.setState({
      textValue: textInput,
      mdValue: mdParser(textInput)
    });
  };

  handleButtonClick = value => {
    let temp = this.state.textValue;

    this.setState({ textValue: temp.concat(value) });
  };

  componentDidMount() {
    const attrs = require("markdown-it-attrs");
    this.md = new Markdown();
    this.md.use(attrs);
  }

  render() {
    return (
      <div className="controlPanelPlacement">
        <ControlPanel handleButtonClick={this.handleButtonClick} />
        <div className="ui two column test grid">
          <div className="column">
            <MDTextArea
              textValue={this.state.textValue}
              onInputChange={this.handleChange}
              handleButtonClick={this.handleButtonClick}
            />
          </div>
          <div className="column">
            <MDPreview mdValue={this.state.mdValue} />
          </div>
        </div>
      </div>
    );
  }
}

export default Editor;
