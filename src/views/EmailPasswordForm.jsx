
import React from 'react';
import axios from 'axios';

export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            stateClass: '',
        };

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleEmailChange(event) {
        const state = this.state;
        state.email = event.target.value;
        this.setState(state);
    }

    handlePasswordChange(event) {
        const state = this.state;
        state.password = event.target.value;
        this.setState(state);
    }

    handleSubmit(event) {
        event.preventDefault();
        axios.post(`${this.props.action}`, { email: this.state.email, password: this.state.password })
            .then((res) => {
                const state = this.state;
                if (res.status === 200)
                    state.stateClass = 'success';
                this.setState(state);
            }).catch((err) => {
                const state = this.state;
                state.stateClass = 'error';
                this.setState(state);
            })
    }

    render() {
        return (
            <form className={`ui form ${this.state.stateClass}`} onSubmit={this.handleSubmit}>
                <h4>{this.props.title}</h4>
                <div className="fields">
                    <div className="field">
                        <label>Email</label>
                        <input onChange={this.handleEmailChange} type="email" id="email" placeholder="email address"/>
                    </div>
                    <div className="field">
                        <label>Password</label>
                        <input onChange={this.handlePasswordChange} type="password" id="password" placeholder="password"/>
                    </div>
                    <input className="small ui button primary" type="submit" value={this.props.btnText}/>
                </div>
                {this.props.children}
            </form>
        )
    }
}
