let https = require('https');
let moment = require('moment');

/**
 * Gets the current price for the given currency pair.
 *
 * @param currencyPair: string: currency to convert from and to, of the format: TCU-FCU
 * @param callback: function:
 * @returns amt: number:        current price of given currencyPair
 */
exports.getCurrentPrice = function (currencyPair, callback) {
    this.getSpotPrice(currencyPair, new Date().toISOString().slice(0, 10), (amt) => {
        callback(amt);
    })
};

/**
 * Fetches data from the given Coinbase API endpoint.
 *
 * @param url: string:          URL to make the GET request to
 * @param callback: function:
 * @returns object:             data returned by GET to url
 */
exports.getJSONFromApi = function (url, callback) {
    https.get(url, (res) => {
        res.on('data', (bin) => {
            callback(JSON.parse(bin));
        })
    }).on('error', (err) => {console.log(err);});
};

/**
 * Builds and returns the URL string for a request to the Coinbase spot price endpoint.
 *
 * @param currencyPair: string: currency to convert from and to, of the format TCU-FCU
 * @param date: string:         date of format YYYY-MM-DD
 * @returns string:             URL to query to get the spot price of the given currencyPair for the given date
 */
exports.makeSpotUrl = function (currencyPair, date) {
    return `https://api.coinbase.com/v2/prices/${currencyPair}/spot?date=${date}`;
};

/**
 * Makes the GET request to the spot price API and return the resulting price data.
 *
 * @param currencyPair: string:  currency pair of the format TCU-FCU
 * @param date: string:          string of the date of the format YYYY-MM-DD
 * @param callback: function:    
 * @returns amt: number:         current price for the given currency pair
 */
exports.getSpotPrice = function (currencyPair, date, callback) {
    console.log('Getting spot price for ' +currencyPair + ' for date: ' + date);
    this.getJSONFromApi(this.makeSpotUrl(currencyPair, date), (json) => {
        callback(json.data.amount);
    })
};

/**
 * Return a list of prices (one price per day) for the given year
 * Calls to getSpotPrice will occur in parallel, thus the order of prices is not
 * guaranteed to be correct
 * @param currencyPair: string:         currency pair of the format TCU-FCU
 * @param year: string:                 year to get prices for
 * @param callback: function:
 * @returns prices: list of objects:    object for each day of the format {date, price}
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
 * Return a list of prices in the given range of dates (inclusive)
 * startDate and endDate must be of the format YYYY-MM-DD
 *
 * @param currencyPair: string:         currencies to convert from and to of the format TCU-FCU
 * @param startDate: string:            string of the date to start on
 * @param endDate: string:              string of the date to end on
 * @param callback: function:
 * @returns prices: list of objects:    object for each day of the format {date, price}
 */
exports.getDailyPricesInRange = function (currencyPair, startDate, endDate, callback) {

    let prices = [];
    let daysRemaining = this.findDaysBetweenDates(startDate, endDate) + 1;

    for (let day = 0; day < daysRemaining; day++) {
        let parsedDate = startMoment.add(day, 'days').toISOString().slice(0, 10);
        this.getSpotPrice(currencyPair, parsedDate, (amt) => {
            prices.push({date: parsedDate, price: amt});
            if (--daysRemaining === 0)
                callback(prices);
        });
    }
};

/**
 * Returns the average of a number of prices
 *
 * @param days: list of numbers:    prices to average
 * @returns number:                 average of the given prices
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
 * Returns a string of the 200 day moving average price for the given currency pair
 *
 * @param currencyPair: string: currencies to convert from and to of the format TCU-FCU
 * @param callback: function:
 * @returns number:             average of the prices of the given currency pair over the past 200 days including today
 */
exports.get200DayMovingAverage = function (currencyPair, callback) {
    this.getDailyPricesInRange(
        currencyPair,
        moment(new Date()).add(-200, 'days').toISOString().slice(0, 10),
        new Date().toISOString().slice(0, 10),
        (prices) => {
            callback(this.getAvgPrice(Object.values(prices)));
    })
};

/**
 * Returns the number of days between two dates
 *
 * @param startDate: string:    start of the date range
 * @param endDate: string:      end of the date range
 * @returns number:             number of days between startDate and endDate
 */
exports.findDaysBetweenDates = function (startDate, endDate) {
    return Math.abs(moment(startDate).diff(endDate, 'days'));
};
