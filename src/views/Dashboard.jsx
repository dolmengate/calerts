import React from 'react';
import axios from 'axios';
import Header from "./Header.jsx";
import LoginForm from "./LoginForm.jsx";
import UserArea from "./UserArea.jsx";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null
        };

        this.componentWillMount = this.componentWillMount.bind(this);
        this.populateUser = this.populateUser.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.getContent = this.getContent.bind(this);
    }

    getContent() {
        if (this.state.user === null) {
            return <div>
                <LoginForm title="Login" btnText="Login" action="/calerts/api/login"/>
                or
                <LoginForm title="Sign up" btnText="Sign up" action="/calerts/api/signup"/>
            </div>;
        }
        return <UserArea user={this.state.user}/>;
    }

    getHeader() {
        if (this.state.user === null) {
            return <Header/>;
        }
        return <Header userEmail={this.state.user.email}/>;
    }

    populateUser() {
        axios.post('/calerts/api/session').then((res) => {
            this.setState({
                user: {
                    email: res.data.email,
                    alerts: res.data.alerts,
                    updates: res.data.updates,
                    settings: res.data.settings
                }
            });
        }).catch((err) => {
            console.log('Session GET error: ' + err);
        })
    }

    componentWillMount() {
        this.populateUser();
    }

    render() {
        return (
            <div className='container'>
                {this.getHeader()}
                {this.getContent()}
            </div>
        );
    }
}

export default Dashboard;
