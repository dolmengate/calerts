import React from 'react';

export default class Updates extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <ol>
                {this.props.items.map((update) => {
                    return <li key={update}>{update.product} - {update.time.hour} : {update.time.minutes}</li>
                })}
            </ol>
        );
    }
}
