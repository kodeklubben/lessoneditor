import React from "react";
import LargeEditor from "./largeScreen/EditorLarge";
import SmallEditor from "./smallScreen/EditorSmall";

var smallScreen = null;

class MarkdownEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      text: ""
    };
    if (window.innerHeight / window.innerWidth > 1.4) {
      smallScreen = true;
    } else {
      smallScreen = false;
    }
  }

  componentDidUpdate() {
    if (window.innerHeight / window.innerWidth > 1.4) {
      smallScreen = true;
    } else {
      smallScreen = false;
    }
  }

  update = () => {
    this.setState({ state: this.state });
  };

  renderOutput() {
    if (smallScreen) {
      return (
        <div>
          <SmallEditor update={this.update} />
        </div>
      );
    } else if (!smallScreen) {
      return (
        <div>
          <LargeEditor update={this.update} />
        </div>
      );
    }
  }

  render() {
    return this.renderOutput();
  }
}

export default MarkdownEditor;
