import React from 'react';

export default class SaveButton extends React.Component {
    render() {
        return (
            <button
                type="button"
                onClick={this.props.onClick}
                className={`ui mini primary ${this.props.active ? '' : 'disabled'} labeled right floated icon button`}
            >
                Save
                <i className="large save icon"/>
            </button>
        );
    }
}
