import React, { useState } from "react";
import "../../index.css";
import MDTextArea from "./MDTextArea";
import MDPreview from "./MDPreview";
import { mdParser } from "../../utils/mdParser";
import ControlPanel from "./ControlPanel";

const Editor = () => {
  const [textValue, setTextValue] = useState("");
  const [mdValue, setMdValue] = useState("");
  const [boolButton, setBoolButton] = useState({
    bold: true,
    italic: true,
    activity: true,
    intro: true,
    inline: true,
    codeBlock: true
  });

  const handleChange = textInput => {
    setTextValue(textInput);
    setMdValue(mdParser(textInput));
  };

  const editorRef = React.createRef();

  // const handleButtonClick = value => {
  //   setTextValue(textValue.concat(value));
  //   editorRef.current.focus();
  // };

  const handleButtonClick = (value, cursorInt, bTitle) => {
    let temp = textValue;
    editorRef.current.focus();
    console.log(editorRef.current);
    // if (boolButton[bTitle]) {
    //   setBoolButton({ [bTitle]: false });
    //   setTextValue(temp.concat(value));
    //   setTimeout(() => {
    //     editorRef.current.selectionStart -= cursorInt;
    //     editorRef.current.selectionEnd -= cursorInt;
    //   }, 0);
    // } else {
    //   setBoolButton({ [bTitle]: true });
    //   setTimeout(() => {
    //     editorRef.current.selectionStart += cursorInt;
    //     editorRef.current.selectionEnd += cursorInt;
    //   }, 0);
    // }
  };

  return (
    <div className="controlPanelPlacement">
      <ControlPanel handleButtonClick={handleButtonClick} />
      <div className="ui two column test grid">
        <div className="column">
          <MDTextArea
            editorRef={editorRef}
            textValue={textValue}
            onInputChange={handleChange}
            handleButtonClick={handleButtonClick}
          />
        </div>
        <div className="column">
          <MDPreview mdValue={mdValue} />
        </div>
      </div>
    </div>
  );
};

/*
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
    console.log(this.state.textValue);
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
*/

export default Editor;
