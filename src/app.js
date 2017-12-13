const WebServer = require('./WebServer.js');
const Calcs = require('./libs/Calcs');
const SendMail = require('./libs/SendMail');
const fs = require('fs');
const path = require('path');
const async = require('async');

let currentPrice = 0;
let mayerIndex = 0;
let twoHundredDayMovingAverage = 0;
let lastUpdated = 0;

run = function () {

    WebServer.start();
    console.log('Server started');

    lastUpdated = new Date();

    Calcs.getCurrentPrice('BTC-USD', (price) => {
        currentPrice = price;
    });

    Calcs.get200DayMovingAverage('BTC-USD', (tdma) => {
        twoHundredDayMovingAverage = tdma;
    });

    Calcs.getMayerIndex((mi) => {
        mayerIndex = mi;
    });

    // dashboard page update
    setInterval(() => {

        lastUpdated = new Date();

        Calcs.getCurrentPrice('BTC-USD', (price) => {
            currentPrice = price;
        });

        Calcs.get200DayMovingAverage('BTC-USD', (tdma) => {
            twoHundredDayMovingAverage = tdma;
        });

        Calcs.getMayerIndex((mi) => {
            mayerIndex = mi;
        })

    }, 60000 * 10); // ten minutes

    // email updates
    setInterval(() => {
        fs.readFile(path.join(__dirname, 'emails', 'users.txt'), (err, usersData) => {
            if (err) throw err;
                async.each(usersData.toString().split('\n'), (user, next) => {
                    if (user)   // don't do blank lines
                        SendMail.send('cbalerts@sroman.info', 'cbalerts Price Update', user,
                            'This is an automated message, please do not respond.' + '\n' + '\n' +
                            'Bitcoin\n' + '\n' + '\n' +
                            'Current Price: ' + currentPrice + '\n' +
                            '200 Daily Moving Average: ' + twoHundredDayMovingAverage + '\n' +
                            'Mayer Index: ' + mayerIndex + '\n' + '\n' +
                            'cbalerts', () => {
                                console.log('Mail to ' + user + ' sent.');
                            });
                    next();
            })
        })
    }, 60000 * 60 * 12); // twelve hours
};

exports.getMayerIndex = function() {
   return mayerIndex;
};

exports.getTwoHundredDMA = function() {
    return twoHundredDayMovingAverage;
};

exports.getLastUpdated = function() {
    return lastUpdated;
};

run();
