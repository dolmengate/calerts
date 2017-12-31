import React from 'react';

export default class TickerItem extends React.Component {
    render() {
        return (
            <span>
                <span>{this.props.symbol}</span> - <span>${this.props.price}</span>
            </span>
        );
    }
}
