const WebServer = require('./WebServer.js');
const Calcs = require('./libs/Calcs');

let mayerIndex = 0;
let twoHundredDayMovingAverage = 0;

run = function () {

    WebServer.start();
    console.log('Server started');

    setInterval(() => {

        console.log('Getting 200dma... ' + new Date());
        Calcs.get200DayMovingAverage('BTC-USD', (tdma) => {
            twoHundredDayMovingAverage = tdma;     // not updating
        });

        console.log('Getting Mayer Index... ' + new Date());
        Calcs.getMayerIndex((mi) => {
            mayerIndex = mi;
        })

    }, 60000 * 10); // ten minutes
};

exports.getMayerIndex = function() {
   return mayerIndex;
};

exports.getTwoHundredDMA = function() {
    return twoHundredDayMovingAverage;
};

run();
