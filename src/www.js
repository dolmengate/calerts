
const path = require('path');
const bodyParser = require('body-parser');

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

    wsserver.on('connection', (socket, req) => {
        req.connection.remoteAddress;
        socket.send('henlo');

        socket.on('message', (msg) => {
            console.log(msg);
        });

        socket.close();
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

