import React from "react";

class MDTextArea extends React.Component {
    onHandleChange = e => {
        this.props.onInputChange(e.target.value);
    };

    render() {
        return (
            <textarea
                className="TextArea"
                value={this.props.textValue}
                onChange={this.onHandleChange}
            />
        );
    }
}

export default MDTextArea;