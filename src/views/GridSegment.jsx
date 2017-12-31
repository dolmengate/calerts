import React from 'react';

export default class GridSegment extends React.Component {
    render() {
        return(
            <div className="ui centered grid">
                <div className="six wide column">
                    <div className="row segment">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}