const www = require('./www.js');
const SendMail = require('./libs/sendmail');
const dbAccess = require('./dbaccess');
const async = require('async');

// TODO cache recent currency pair data
// TODO keep cache of update times to be updated only when a user adds or removes an update (to prevent having to query entire DB for updates each 5 minutes)

run();

function run() {

    www.start();
    console.log('Server started');

    // email updates
    // check each minute if the current minutes are a multiple of 5
    // setInterval(() => {
    //     let now = new Date();
    //     if (Math.floor((now.getTime() / 60000)) % 5 === 0) { // MAKE A USER HAVE AN UPDATE TIME THATS SOON THEN TEST
    //         console.log('Checking user updates');
    //         // find all users
    //         dbAccess.findUsers(({}), (db, curs) => {
    //             curs.forEach((user) => {
    //                 async.each(user.settings.currencyPairs, (currencyPair, nextPair) => {
    //                     async.each(currencyPair.updateTimes, (time, nextTime) => {
    //                         if (now.getHours() === time.hour && now.getMinutes() === time.minute) {
    //                             www.getTickerData(currencyPair.pair, (tdma, mm, cp) => {
    //                                 SendMail.send('calerts@sroman.info', 'calerts Price Update', user.emailAddress,
    //                                     'This is an automated message, please do not respond.' + '\n' + '\n' +
    //                                     currencyPair.pair + '\n' + '\n' + '\n' +
    //                                     'Current Price: ' + cp + '\n' +
    //                                     '200 Daily Moving Average: ' + tdma + '\n' +
    //                                     'Mayer Multiple: ' + mm + '\n' + '\n' +
    //                                     'calerts', () => {
    //                                         console.log('Update mail to ' + user.emailAddress + ' sent.');
    //                                     });
    //                             })
    //                         }
    //                         nextTime();
    //                     });
    //                     nextPair();
    //                 })
    //             });
    //             db.close();
    //         });
    //     }
    // }, 60000)
}
