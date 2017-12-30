
import React from 'react';
import axios from 'axios';

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {email: '', password: ''};

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleEmailChange(event) {
        this.setState( {email: event.target.value, password: this.state.password} );
    }

    handlePasswordChange(event) {
        this.setState( {email: this.state.email, password: event.target.value} );
    }

    handleSubmit(event) {
        event.preventDefault();
        axios.post(`${this.props.action}`, { email: this.state.email, password: this.state.password }).catch((err) => {
            console.error(err);
        })
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <h4>{this.props.title}</h4>
                <input onChange={this.handleEmailChange} type="email" id="email" placeholder="email address"/>
                <input onChange={this.handlePasswordChange} type="password" id="password" placeholder="password"/>
                <input type="submit" value={this.props.btnText}/>
            </form>
        )
    }
}

export default LoginForm;
