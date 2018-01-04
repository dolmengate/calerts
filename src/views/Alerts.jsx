import React from 'react';
import AlertCondition from './AlertCondition.jsx';

export default class Alerts extends React.Component {
    constructor(props){
        super(props);
        this.renderAlert = this.renderAlert.bind(this);
    }

    renderAlert(alert) {
        return <ul key={alert}>
            <h3>{alert.name}</h3>
            <h4>Conditions</h4>
            {
                alert.conditions.map((condition) => {
                return <AlertCondition key={condition} condition={condition}/>;
                })
            }
        </ul>;
    }

    render() {
        return (
            <ul>
                {
                    this.props.items.map((alert) => {
                        return this.renderAlert(alert);
                    })
                }
                <span tabIndex="0" className="ui right floated mini button">Add condition</span>
            </ul>
        );
    }
}
