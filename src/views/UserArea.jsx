import React from 'react';
import Alerts from "./Alerts.jsx";
import Updates from "./Updates.jsx";

export default class UserArea extends React.Component {
    render() {
        return (
            <div className="ui centered center aligned divided grid segment">
                <div className="row">
                    <h3 className="ui header">Dashboard</h3>
                </div>
                <div className="row">
                    <h4 className="ui sub header">Alerts</h4>
                    <Alerts items={this.props.user.alerts}/>
                </div>
                <div className="row">
                    <h4 className="ui sub header">Updates</h4>
                    <Updates items={this.props.user.updates}/>
                </div>
            </div>
        );
    }
}
