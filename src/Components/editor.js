import React from 'react';
import '../index.css';
import MDTextArea from './textinput';
import MDPreview from './mdpreview';
import Markdown from 'markdown-it'

class Editor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            textValue: '',
            mdValue: '',
        }
    }

    handleChange = (textInput) => {
        this.setState(
            {
                textValue: textInput,
                mdValue: this.md.render(textInput)
            });
    };

    componentDidMount() {
        this.md = new Markdown();
    }

    render() {
        return (
            <div className="Editor">
                <MDTextArea
                    textValue={this.state.textValue}
                    onInputChange={this.handleChange}
                />
                <MDPreview
                    mdValue={this.state.mdValue}
                />
            </div>
        );
    }
}

export default Editor;