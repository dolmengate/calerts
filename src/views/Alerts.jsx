import React from 'react';
import AlertCondition from './AlertCondition.jsx';
import SaveButton from "./SaveButton.jsx";
import PostButton from "./PostButton.jsx";

export default class Alerts extends React.Component {
    constructor(props){
        super(props);
        this.renderAlert = this.renderAlert.bind(this);
    }

    renderAlert(alert, alertIndex) {
        return <ul key={alertIndex}>
            <div className="ui labeled input" style={{width: '10em'}}>
                <div className="ui label">Name</div>
                <input
                    type="text"
                    placeholder="Alert name"
                    defaultValue={alert.name}
                    onChange={(event) => this.props.onAlertNameChange(event, alertIndex)}
                />
            </div>
            <button
                className="ui mini labeled right floated icon button"
                onClick={() => this.props.onAddNewConditionClick(alertIndex)}
            >
                Add Alert Condition
                <i className="ui large add square icon"/>
            </button>
            <div className="ui horizontal divider header">Conditions</div>
                <div>
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
                                onDeleteSymbolClick={this.props.onDeleteConditionSymbolClick}
                            />
                        </div>
                    })
                }
                </div>
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
                <div style={{marginTop: '2em'}}>
                    <div
                        onClick={this.props.onAddNewAlertClick}
                        className="ui right floated mini labeled icon button"
                    >
                        <i className="ui large add square icon" />
                        Add Alert
                    </div>
                    <SaveButton
                        onClick={this.props.onSaveAlertsClick}
                        active={this.props.hasPendingChanges}
                    />
                </div>
            </div>
        );
    }
}
