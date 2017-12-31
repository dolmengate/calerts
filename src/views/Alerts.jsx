import React from 'react';

export default class Alerts extends React.Component {

    render() {
        return (        // TODO table instead of ol
            <ol>
                {this.props.items.map((alert) => {
                    return <li key={alert}>
                        {alert.name}
                        <ul>
                            {alert.conditions.map((condition) => {
                                return <li key={condition}> {condition} </li>;
                            })}
                        </ul>
                    </li>;
                })}
            </ol>
        );
    }
}
