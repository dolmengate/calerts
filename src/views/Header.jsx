import React from 'react';
import PostButton from './PostButton.jsx'
import Ticker from "./Ticker.jsx";

class Header extends React.Component {
    render() {
        return (
            <div>
                <h1>calerts</h1>
                <Ticker/>
                <span>{this.props.userEmail}</span>
                <PostButton text="Logout" action="/calerts/api/logout"/>
            </div>
        );
    }
}

export default Header;
