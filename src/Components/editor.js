import React from 'react';
import '../index.css';
import MDTextArea from './textinput';
import MDPreview from './mdpreview';
import Markdown from 'markdown-it'
import {mdParser} from '../utils/mdParser';

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
                mdValue: mdParser(textInput)
            });
    };

    componentDidMount() {
        const attrs = require('markdown-it-attrs');
        this.md = new Markdown();
        this.md.use(attrs);
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