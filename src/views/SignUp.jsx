import React from 'react';
import EmailPasswordForm from "./EmailPasswordForm.jsx";

export default class SignUp extends React.Component {
    render() {
        return (
            <div>
                <EmailPasswordForm title="Sign up" btnText="Sign up" action="/calerts/api/signup">
                    <div className="ui success message">
                        <div className="header">Almost done</div>
                        <p>Be sure to click the link in your verification e-mail!</p>
                    </div>
                    <div className="ui error message">
                        <div className="header">Oops</div>
                        <p>E-mail address or password was incorrect.</p>
                        <p>Passwords must be blah blah blah</p>
                    </div>
                </EmailPasswordForm>
                or <a onClick={this.props.onLogInClick}>log in</a>
            </div>
        );
    }
}
