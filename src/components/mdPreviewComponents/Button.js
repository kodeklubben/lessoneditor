import React from "react";
import { Icon } from "semantic-ui-react";


class Button extends React.Component {
    onButtonClick = () => {
        this.props.onButtonClick(this.props.output);

        if (this.test === "") {
            this.test = "inverted";
        } else {
            this.test = "";
        }
    };

    render() {
        return (
            <div onClick={this.onButtonClick}>
                <button>
                    <i className={`${this.props.icon} icon`} />
                    {this.props.title}
                </button>
            </div>
        );
    }
}

export default Button;