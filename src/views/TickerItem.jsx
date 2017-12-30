import React from 'react';

class TickerItem extends React.Component {
    render() {
        return (
            <span className="d-sm-inline-block m-4">
                <span>{this.props.symbol}</span><span>${this.props.price}</span>
            </span>
        );
    }
}

export default TickerItem;
