import React from 'react';
import Ticker from "./Ticker.jsx";
import PostButton from "./PostButton.jsx";

export default class Header extends React.Component {
    render() {
        return (
            <div className="ui centered center aligned padded grid">
                <div className="row" style={ {background: "#282C34"} }>
                    <div className="column">
                        <h1>calerts</h1>
                    </div>
                    <div className="center aligned ten wide column">
                        <Ticker/>
                    </div>
                    <div className="column">
                        <span>{this.props.userEmail}</span>
                    </div>
                    <div className="column">
                        <PostButton styles="mini ui negative button" action="/calerts/api/logout">
                            <i className="sign out icon"/> Logout
                        </PostButton>
                    </div>
                </div>
            </div>
        );
    }
}
