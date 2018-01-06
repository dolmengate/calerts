import React from 'react';
import Alerts from "./Alerts.jsx";
import Updates from "./Updates.jsx";

export default class UserArea extends React.Component {
    render() {
        return (// todo make 'dashboard' header look different than 'alerts' and 'updates' headers
        <div>
            <span style={{fontSize: '20em', color: 'rgb(0, 0, 0, 0.1)', marginLeft: '.2em', marginTop: '.2em'}}>dashboard</span>
            <div className="ui grid container">
                <h4 className="ui top attached header">Dashboard</h4>
                <div className="ui grid container segment">
                    <h3 className="ui header top attached">Alerts</h3>
                    <div className="row segment">
                        <Alerts
                            items={this.props.user.alerts}
                            hasPendingChanges={this.props.hasPendingAlertsChanges}
                            onSaveAlertsClick={this.props.onSaveAlertsClick}
                            onConditionSymbolChange={this.props.onConditionSymbolChange}
                            onAddNewSymbolClick={this.props.onAddNewSymbolClick}
                            onAddNewConditionClick={this.props.onAddNewConditionClick}
                            onDeleteConditionSymbolClick={this.props.onDeleteConditionSymbolClick}
                            onAddNewAlertClick={this.props.onAddNewAlertClick}
                        />
                    </div>
                    <h3 className="ui header top attached">Updates</h3>
                    <div className="centered row segment">
                        <Updates
                            items={this.props.user.updates}
                            hasPendingChanges={this.props.hasPendingUpdatesChanges}
                            onSaveUpdatesClick={this.props.onSaveUpdatesClick}
                            onAddNewUpdateClick={this.props.onAddNewUpdateClick}
                            onDeleteUpdateClick={this.props.onDeleteUpdateClick}
                            onToggleUpdateActiveClick={this.props.onToggleUpdateActiveClick}
                            onUpdateHourChange={this.props.onUpdateHourChange}
                            onUpdateMinuteChange={this.props.onUpdateMinuteChange}
                            onUpdateProductChange={this.props.onUpdateProductChange}
                            onUpdateNameChange={this.props.onUpdateNameChange}
                            onUpdateDescriptionChange={this.props.onUpdateDescriptionChange}
                        />
                    </div>
                </div>
            </div>
        </div>
        );
    }
}
