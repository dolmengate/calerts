const www = require('./www.js');
const SendMail = require('./libs/sendmail');
const fs = require('fs');
const path = require('path');
const async = require('async');

let currentPrice = 0;
let mayerMultiple = 0;
let twoHundredDayMovingAverage = 0;
let lastUpdated = 0;


// TODO cache recent currency pair data
// TODO refactor email updates to users from DB instead of extinct user.txt
run = function () {

    www.start();
    console.log('Server started');

    // email updates
    setInterval(() => {
        fs.readFile(path.join(__dirname, 'emails', 'users.txt'), (err, usersData) => {
            if (err) throw err;
                async.each(usersData.toString().split('\n'), (user, next) => {
                    if (user)   // don't do blank lines
                        SendMail.send('calerts@sroman.info', 'calerts Price Update', user,
                            'This is an automated message, please do not respond.' + '\n' + '\n' +
                            'Bitcoin\n' + '\n' + '\n' +
                            'Current Price: ' + currentPrice + '\n' +
                            '200 Daily Moving Average: ' + twoHundredDayMovingAverage + '\n' +
                            'Mayer Multiple: ' + mayerMultiple + '\n' + '\n' +
                            'calerts', () => {
                                console.log('Mail to ' + user + ' sent.');
                            });
                    next();
            })
        })
    }, 60000 * 60 * 12); // twelve hours
};

exports.getmayerMultiple = function() {
   return mayerMultiple;
};

exports.getTwoHundredDMA = function() {
    return twoHundredDayMovingAverage;
};

exports.getLastUpdated = function() {
    return lastUpdated;
};

exports.getCurrentPrice = function() {
    return currentPrice;
};

run();
