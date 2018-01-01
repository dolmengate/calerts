import React from 'react';
import Alerts from "./Alerts.jsx";
import Updates from "./Updates.jsx";

export default class UserArea extends React.Component {
    render() {
        return (// todo make 'dashboard' header look different than 'alerts' and 'updates' headers
            <div className="ui grid container">
                <h4 className="ui top attached header">Dashboard</h4>
                <div className="ui grid container segment">
                    <h3 className="ui header top attached">Alerts</h3>
                    <div className="centered row segment">
                        <Alerts items={this.props.user.alerts}/>
                    </div>
                    <h3 className="ui header top attached">Updates</h3>
                    <div className="centered row segment">
                        <Updates
                            items={this.props.user.updates}
                            onAddNewUpdateClick={this.props.onAddNewUpdateClick}
                            onDeleteUpdateClick={this.props.onDeleteUpdateClick}
                            onToggleUpdateActiveClick={this.props.onToggleUpdateActiveClick}
                            onUpdateHourChange={this.props.onUpdateHourChange}
                            onUpdateMinuteChange={this.props.onUpdateMinuteChange}
                        />
                    </div>
                </div>
            </div>
        );
    }
}
