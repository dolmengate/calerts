import React from 'react';
import axios from 'axios';
import Header from "./Header.jsx";
import UserArea from "./UserArea.jsx";
import Login from "./Login.jsx";
import SignUp from "./SignUp.jsx";
import GridSegment from "./GridSegment.jsx";

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            content: 'login'
        };

        this.componentWillMount = this.componentWillMount.bind(this);
        this.populateUser = this.populateUser.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.getContent = this.getContent.bind(this);
        this.onSignUpClick = this.onSignUpClick.bind(this);
        this.onLogInClick = this.onLogInClick.bind(this);
    }

    onSignUpClick() {
        const state = this.state;
        state.content = 'signup';
        this.setState(state);
    }

    onLogInClick() {
        const state = this.state;
        state.content = 'login';
        this.setState(state);
    }

    getContent() {
        if (this.state.user === null) {
            switch (this.state.content) {
                case 'login':
                    return <GridSegment>
                        <Login onSignUpClick={this.onSignUpClick}/>
                    </GridSegment>;
                case 'signup':
                    return <GridSegment>
                        <SignUp onLogInClick={this.onLogInClick}/>
                    </GridSegment>;
            }
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
            <div>
                {this.getHeader()}
                {this.getContent()}
            </div>
        );
    }
}
