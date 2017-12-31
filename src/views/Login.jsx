import React from 'react';
import EmailPasswordForm from "./EmailPasswordForm.jsx";

export default class Login extends React.Component {
    render() {
        return (
            <div>
                <EmailPasswordForm title="Login" btnText="Login" action="/calerts/api/login">
                    <div className="ui error message">
                        <div className="header">Oops</div>
                        <p>E-mail address or password was incorrect.</p>
                    </div>
                </EmailPasswordForm>
                or <a onClick={this.props.onSignUpClick}>sign up</a>
            </div>
        );
    }
}
