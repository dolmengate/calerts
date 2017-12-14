
const path = require('path');
const bodyParser = require('body-parser');
const Calcs = require('./libs/Calcs');

const PORT = '8080';

/* express setup */
const express = require('express');
const app = express();

/* websocket server setup */
const WebSocket = require('ws');

const server = require('http').Server(app);
const wsserver = new WebSocket.Server( {server} );

/* express routes */
const dashboard = require('./routes/dashboard');
const signup = require('./routes/signup');

exports.start = function () {

    // while a user is connected update the page results
    wsserver.on('connection', (socket, req) => {
        socket.on('message', (msg) => {
            console.log(msg);
        });

        setInterval(() => {
            // prevent WebSocket from throwing 'not opened' error
            if (socket.readyState === WebSocket.OPEN) {
                Calcs.get200DayMovingAverage('BTC-USD', (tdma) => {
                    Calcs.getMayerIndex((mi) => {
                        Calcs.getCurrentPrice('BTC-USD', (cp) => {
                            socket.send(
                                JSON.stringify(
                                    {
                                        twoHundredDayMovingAverage: tdma.toFixed(2),
                                        mayerIndex: mi.toFixed(1),
                                        currentPrice: cp.toFixed(2)
                                    }
                                ), null, (err) => { if (err) throw err; })
                        })
                    })
                })
            }
        }, 10000);  // ten seconds
    });

    // set static files serving
    app.use(express.static(path.join(__dirname, 'public')));

    // setup view locations and interpretation
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'pug');

    // allow reading request body
    app.use(bodyParser.urlencoded());
    app.use(bodyParser.json());

    /* Dashboard mapping */
    app.use('/cb-alerts/dashboard', dashboard);
    app.use('/cb-alerts/signup', signup);

    // catch and forward 404
    app.use((req, res, next) => {
        let err = new Error('404 - Not Found');
        err.status = 404;
    });

    server.listen(8080);
    console.log('app listening on port: ' + PORT);
};

