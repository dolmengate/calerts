
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = '8080';

const dashboard = require('./routes/dashboard');
const signup = require('./routes/signup');

// set static files serving
const options = { extensions: ['js'] };
app.use(express.static(path.join(__dirname, 'public')));

// setup view locations and interpretation
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// allow reading request body
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

/* Dashboard mapping */
app.use('/cb-alerts/dashboard/', dashboard);
app.use('/cb-alerts/signup', signup);

// catch and forward 404
app.use((req, res, next) => {
    let err = new Error('404 - Not Found');
    err.status = 404;
    next(err);
});

app.listen(PORT);
console.log('app listening on port: ' + PORT);
