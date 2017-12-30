import React from 'react';
import TickerItem from "./TickerItem.jsx";

class Ticker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tickerItems: [
                {
                    lastPrice: 0,
                    side: 'sell',
                    product_id: 'BTC-USD'
                },
                {
                    lastPrice: 0,
                    side: 'sell',
                    product_id: 'LTC-USD'
                },
                {
                    lastPrice: 0,
                    side: 'sell',
                    product_id: 'ETH-USD'
                },
                {
                    lastPrice: 0,
                    side: 'sell',
                    product_id: 'BCH-USD'
                },
            ],
        };

        this.configureSocket = this.configureSocket.bind(this);
    }

    configureSocket() {
        const socket = new WebSocket('wss://localhost:3000');

        // ensure all data is sent and close the socket before leaving the page
        window.onbeforeunload = () => {
            if (socket.readyState !== WebSocket.CLOSED && !socket.bufferedAmount) {
                socket.close();
                console.log('Socket closed');
            }
        };

        socket.onopen = () => {
            console.log('Socket open');
            socket.send('User connected.');
            document.getElementById('socket-status').setAttribute('class', 'badge badge-success');
        };

        socket.onerror = (err) => {
            console.log('There was an error with a socket connection ' + err);
            document.getElementById('socket-status').setAttribute('class', 'badge badge-danger');
        };

        socket.onmessage = (e) => {
            console.log('Socket message received ' + e.data);
            const data = JSON.parse(e.data);
            this.setState({     // todo temporary before GDAX ticker socket integration
                tickerItems: [
                    {
                        lastPrice: data.currentPrice,
                        side: 'sell',
                        product_id: 'BTC-USD'
                    },
                    {
                        lastPrice: 0,
                        side: 'sell',
                        product_id: 'LTC-USD'
                    },
                    {
                        lastPrice: 0,
                        side: 'sell',
                        product_id: 'ETH-USD'
                    },
                    {
                        lastPrice: 0,
                        side: 'sell',
                        product_id: 'BCH-USD'
                    },
                ],
            });
        };

        socket.onclose = (e) => {
            console.log('Socket closed');
            document.getElementById('socket-status').setAttribute('class', 'badge badge-warning');
        };
    }

    componentWillMount() {
        this.configureSocket();
    }

    render() {
        return (
            <div className="d-inline-block">
                    {this.state.tickerItems.map((item, i) => {
                        return <TickerItem key={i} symbol={item.product_id} price={item.lastPrice}/>;
                    })}
                <span id='socket-status' className="badge badge-danger">Socket status</span>
            </div>
        );
    }
}

export default Ticker;
