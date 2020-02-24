import React from "react";
import Button from "./Button";

class MDTextArea extends React.Component {
    state = { insertString: "" };

    onHandleChange = e => {
        this.props.onInputChange(e.target.value);
    };

    render() {
        return (
            <div>
        <textarea
            className="TextArea"
            value={this.props.textValue}
            onChange={this.onHandleChange}
        />
            </div>
        );
    }
}

export default MDTextArea;