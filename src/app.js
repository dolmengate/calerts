let https = require('https');
let moment = require('moment');

/**
 * Gets the current price for the given currency pair
 * @param currencyPair string of the currency to convert from and to of the format TCU-FCU
 * @param callback
 */
exports.getCurrentPrice = function (currencyPair, callback) {
    this.getSpotPrice(currencyPair, new Date().toISOString().slice(0, 10), (amt) => {
        callback(amt);
    })
};

/**
 * Fetches a price from the Coinbase spot price API endpoint
 * @param url       URL to make the request to
 * @param callback
 */
exports.getPriceFromApi = function (url, callback) {
    https.get(url, (res) => {
        res.on('data', (bin) => {
            let amt = JSON.parse(bin).data.amount;
            callback(amt);
        })
    }).on('error', (err) => {console.log(err);});
};

/**
 * Builds and returns the URL string for a request to the Coinbase spot price endpoint.
 * @param currencyPair  string of the currency to convert from and to of the format TCU-FCU
 * @param date          string of the date of format YYYY-MM-DD (UTC)
 */
exports.makeSpotUrl = function (currencyPair, date) {
    return `https://api.coinbase.com/v2/prices/${currencyPair}/spot?date=${date}`;
};

/**
 * Make the GET request to the spot price API and return the resulting price data.
 * @param currencyPair string of the currency pair of the format BAS-CUR
 * @param date         string of the date of the format YYYY-MM-DD (months are NOT zero indexed as with Date)
 * @param callback     function to do something with the amount retrieved
 */
exports.getSpotPrice = function (currencyPair, date, callback) {
    console.log('Getting spot price for ' +currencyPair + ' for date: ' + date);
    this.getPriceFromApi(this.makeSpotUrl(currencyPair, date), (amt) => {
        callback(amt);
    })
};

/**
 * Return a list of prices (one price per day) for the given year
 * Calls to getSpotPrice will occur in parallel, thus the order of prices is not
 * guaranteed to be correct
 * @param currencyPair  string
 * @param year          string of the current year
 * @param callback      function
 */
exports.getDailyPricesForHistoricalYear = function (currencyPair, year, callback) {

    let prices = [];
    let daysRemaining = 365;
    const months = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    months.forEach((daysInMonth, i) => {
        // ensure the month is 2 digits long and is not zero indexed
        let iAsMonth = (i < 9) ? '0' + (i + 1) : i + 1;
        for (let day = 1; day <= daysInMonth; day++) {
            // ensure the day is 2 digits long
            let normalizedDay = (day.toString().length === 2) ? day : '0' + day;
            let parsedDate = `${year}-${iAsMonth}-${normalizedDay}`;
            this.getSpotPrice(currencyPair,parsedDate, (amt) => {
                prices.push({date: parsedDate, price: amt});

                // only invoke callback if all the requests are complete
                if (--daysRemaining === 0)
                    callback(prices);
            });
        }
    });
};

/**
 * Return a list of prices in the given range of dates of the given frequency
 * @param currencyPair
 * @param startDate
 * @param endDate
 * @param callback
 */
exports.getDailyPricesInRange = function (currencyPair, startDate, endDate, callback) {

    let prices = [];
    let daysRemaining = this.findDaysBetweenDates(startDate, endDate) + 1;

    for (let day = 0; day < daysRemaining; day++) {
        let parsedDate = moment(startDate).add(day, 'days').toISOString().slice(0, 10);
        this.getSpotPrice(currencyPair, parsedDate, (amt) => {
            prices.push({date: parsedDate, price: amt});
            if (--daysRemaining === 0)
                callback(prices);
        });
    }
};

/**
 * Returns the average of the prices in a given list
 * @param days the list of prices to average
 *
 */
exports.getAvgPrice = function (days) {
    let total = Object.keys(days).length;
    let sum = 0;

    days.forEach((day) => {
        sum += Number(day.price);
    });

    return sum / total;
};

/**
 * Returns a string of the 200 day moving average price of the given currency pair
 * @param currencyPair
 * @param callback
 */
exports.get200DayMovingAverage = function (currencyPair, callback) {
    this.getDailyPricesInRange(
        currencyPair,
        moment(new Date()).add(-200, 'days').toISOString().slice(0, 10),
        moment(new Date()).add(0, 'days').toISOString().slice(0, 10),
        (prices) => {
            callback(this.getAvgPrice(prices));
    })
};

/**
 * Returns the number of days between two dates of the format YYYY-MM-DD
 * @param startDate
 * @param endDate
 */
exports.findDaysBetweenDates = function (startDate, endDate) {
    return Math.abs(moment(startDate).diff(endDate, 'days'));
};
