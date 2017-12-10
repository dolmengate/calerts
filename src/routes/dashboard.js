const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = '8080';

const options = { extensions: ['js'] };
express.static(path.join(__dirname, 'public'), options);

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

// main route
app.route('/cb-alerts/dashboard')
    .get((req, res) => {
        res.render('dashboard');
    })
    .post((req, res) => {
        console.log(req.headers);
        res.render('dashboard', {
           message: req.body.message
        });
    });

// catch and forward 404
app.use((req, res, next) => {
    let err = new Error('404 - Not Found');
    err.status = 404;
    next(err);
});

app.listen(PORT);
console.log('app listening on port: ' + PORT);
