import React from 'react';
import AlertCondition from './AlertCondition.jsx';
import SaveButton from "./SaveButton.jsx";

export default class Alerts extends React.Component {
    constructor(props){
        super(props);
        this.renderAlert = this.renderAlert.bind(this);
    }

    renderAlert(alert, alertIndex) {
        return <ul key={alertIndex}>
            <h3>{alert.name}</h3>
            <button
                className="ui mini labeled icon button"
                onClick={() => this.props.onAddNewConditionClick(alertIndex)}
            >
                Add new condition
                <i className="ui large add square icon"/>
            </button>
            {
                alert.conditions.map((condition, conditionIndex) => {
                    return <div key={conditionIndex}>
                        <AlertCondition
                            key={conditionIndex}
                            id={conditionIndex}
                            alertId={alertIndex}
                            condition={condition}
                            onSymbolChange={this.props.onConditionSymbolChange}
                            onAddNewSymbolClick={this.props.onAddNewSymbolClick}
                        />
                    </div>
                })
            }
        </ul>;
    }

    render() {
        return (
            <div>
                <ul>
                    {
                        this.props.items.map((alert, alertIndex) => {
                            return this.renderAlert(alert, alertIndex);
                        })
                    }
                </ul>
                <div style={{marginTop: '1em'}}>
                    <SaveButton onClick={this.props.onSaveAlertsClick} active={this.props.hasPendingChanges}/>
                </div>
            </div>
        );
    }
}
