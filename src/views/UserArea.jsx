import React from 'react';
import Alerts from "./Alerts.jsx";
import Updates from "./Updates.jsx";

class UserArea extends React.Component {
    render() {
        return (
            <div>
                <h4>Alerts</h4>
                <Alerts items={this.props.user.alerts}/>
                <h4>Updates</h4>
                <Updates items={this.props.user.updates}/>
            </div>
        );
    }
}

export default UserArea;
