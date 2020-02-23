import React from 'react';

class MDPreview extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div
                className="MDPreview"
                dangerouslySetInnerHTML={{__html: this.props.mdValue}}
            />
    );
    }
}

export default MDPreview;