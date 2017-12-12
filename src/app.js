const WebServer = require('./WebServer.js');
const Calcs = require('./libs/Calcs');

let mayerIndex = 0;
let twoHundredDayMovingAverage = 0;
let lastUpdated = 0;

run = function () {

    WebServer.start();
    console.log('Server started');

    setInterval(() => {

        lastUpdated = new Date();
        Calcs.get200DayMovingAverage('BTC-USD', (tdma) => {
            twoHundredDayMovingAverage = tdma;     // not updating
        });

        Calcs.getMayerIndex((mi) => {
            mayerIndex = mi;
        })

    }, 60000 * 1); // ten minutes
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
