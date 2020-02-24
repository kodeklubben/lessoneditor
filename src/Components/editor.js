import React from "react";
import "../index.css";
import MDTextArea from "./textinput";
import MDPreview from "./mdpreview";
import Markdown from "markdown-it";
import { mdParser } from "../utils/mdParser";
import Button from "./Button";

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
      <div>
        <div className="Buttons">
          <div className="ui grid">
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
            <div className="grid">
              <Button
                icon=""
                output=" {.activity} "
                title="Activity"
                onButtonClick={this.handleButtonClick}
              />
            </div>
            <div className="grid">
              <Button
                icon=""
                output=" {.intro} "
                title="Introduction"
                onButtonClick={this.handleButtonClick}
              />
            </div>
          </div>
        </div>

        <div className="Editor">
          <MDTextArea
            textValue={this.state.textValue}
            onInputChange={this.handleChange}
            handleButtonClick={this.handleButtonClick}
          />
          <MDPreview mdValue={this.state.mdValue} />
        </div>
      </div>
    );
  }
}

export default Editor;
