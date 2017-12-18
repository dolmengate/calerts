let https = require('https');
let moment = require('moment');
let async = require('async');

const GDAX_HOST_NAME = 'api.gdax.com';
let COINBASE_HOST_NAME = 'api.coinbase.com';

/**
 * Builds and returns the URL string for a request to the Coinbase spot price endpoint.
 *
 * @param currencyPair: string: currency to convert from and to, of the format TCU-FCU
 * @param date: string:         date of format YYYY-MM-DD
 * @returns string:             path and query parameters to get the spot price of the given currencyPair for the given date
 */
exports.makeCoinbaseSpotPath = function (currencyPair, date) {
    return `/v2/prices/${currencyPair}/spot?date=${date}`;
};

/**
 * Builds and returns the URL string for a request to the GDAX historical rates endpoint.
 *
 * @param currencyPair: string:     ID of the currency pair to create request path for of the format BAS-CUR
 * @param startDate: string:        date of the start of the range to get rates for, of ISO format
 * @param endDate: string:          date of the end of the range to get rates for, of ISO format
 * @param granularity: string:      frequency of data sample in seconds. higher is less frequent.
 * @returns string:                 path and query parameters to get the historical rates of the given currency pair for the given date range
 */
exports.makeGDAXHistoricalRatesPath = function (currencyPair, startDate, endDate, granularity) {
    return `/products/${currencyPair}/candles?start=${startDate}&end=${endDate}&granularity=${granularity}`;
};

/**
 * Gets the current price for the given currency pair from the Coinbase API.
 *
 * @param currencyPair: string: currency to convert from and to, of the format: TCU-FCU
 * @param callback: function:
 * @returns amt: number:        current price of given currencyPair
 */
exports.getCurrentPrice = function (currencyPair, callback) {
    this.getSpotPrice(currencyPair, new Date().toISOString().slice(0, 10), (amt) => {
        callback(Number(amt));
    })
};

/**
 * Fetches JSON data from an API endpoint.
 *
 * @param hostName: string:     name of the host for the URL (e.g.: 'api.gdax.com')
 * @param path: string:         name of the path for the URL (e.g.: '/products/BTC-USD/')
 * @param callback: function:
 * @returns object:             data returned by GET to url
 */
exports.getJsonFromApi = function (hostName, path, callback) {
    https.get({ hostname: hostName, path: path, headers: {'User-Agent': 'curl/7.47.0'}},(res) => {
        if (res.statusCode === 200) {
            res.on('data', (bin) => {
                callback(JSON.parse(bin));
            })
        } else {
            throw new Error('Response to GET was unexpected: ' + res.statusCode + ' ' + res.statusMessage);
        }
    }).on('error', (err) => {
        console.log(err);
    });
};

/**
 * Gets the spot price of a currency pair from the Coinbase API at the given date.
 *
 * @param currencyPair: string:  currency pair of the format TCU-FCU
 * @param date: string:          string of the date of the format YYYY-MM-DD
 * @param callback: function:
 * @returns amt: number:         current price for the given currency pair
 */
exports.getSpotPrice = function (currencyPair, date, callback) {
    this.getJsonFromApi(COINBASE_HOST_NAME, this.makeCoinbaseSpotPath(currencyPair, date), (json) => {
        callback(json.data.amount);
    })
};

/**
 * Returns the time, low, high, open, close and volume for a currency pair in a range of time in a given time interval from the GDAX API.
 * A request that returns over 200 data points will be rejected.
 *
 * @param currencyPair: string:             currencies to convert from and to of the format TCU-FCU
 * @param startDate: string:                lower bounds of time interval to get data for
 * @param endDate: string:                  upper bounds of time interval to get data for
 * @param granularity: number:              frequency in seconds by which to get data in the given time range (higher is less frequent)
 * @param callback
 * @returns intervalData: array of objects: an object describing the attributes of a currency for a point in time determined by the granularity
 */
exports.getGDAXHistoricalRates = function (currencyPair, startDate, endDate, granularity, callback) {
    let url = this.makeGDAXHistoricalRatesPath(currencyPair, startDate, endDate, granularity);
    this.getJsonFromApi(GDAX_HOST_NAME, url, (ratesArray) => {
        let intervalData = [];
        async.each(ratesArray, (ratesGroup, next) => {
            intervalData.push({time: ratesGroup[0], low: ratesGroup[1], high: ratesGroup[2], open: ratesGroup[3], close: ratesGroup[4], volume: ratesGroup[5]});
            next();
        });
        callback(intervalData);
    })
};

/**
 * Gets the daily price of a currency pair in the given date range from the Coinbase API.
 *
 * @param currencyPair: string:         currencies to convert from and to of the format TCU-FCU
 * @param startDate: string:            string of the date to start on of the format YYYY-MM-DD
 * @param endDate: string:              string of the date to end on of the format YYYY-MM-DD
 * @param callback: function:
 * @returns days: array of objects:     object for each day of the format {date, price}
 */
exports.getDailyPricesInRange = function (currencyPair, startDate, endDate, callback) {

    let days = [];
    let daysRemaining = this.findDaysBetweenDates(startDate, endDate) + 1;

    for (let day = 0; day < daysRemaining; day++) {
        let parsedDate = moment(startDate).add(day, 'days').toISOString().slice(0, 10);
        this.getSpotPrice(currencyPair, parsedDate, (amt) => {
            days.push({date: parsedDate, price: amt});
            if (--daysRemaining === 0)
                callback(days);
        });
    }
};

/**
 * Returns the average of a number of prices
 *
 * @param prices: array of numbers:    prices to average
 * @returns number:                 average of the given prices
 */
exports.getAvgPrice = function (prices) {
    let total = Object.keys(prices).length;
    let sum = 0;

    prices.forEach((price) => {
        sum += Number(price);
    });

    return sum / total;
};

/**
 * Returns a string of the 200 day moving average price for the given currency pair. Prices pulled from the Coinbase API.
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
        (days) => {
            let prices = [];
            days.forEach((day) => {
                prices.push(day.price);
            });
            callback(this.getAvgPrice(prices));
        })
};

/**
 * Returns the number of days between two dates.
 *
 * @param startDate: string:    start of the date range
 * @param endDate: string:      end of the date range
 * @returns number:             number of days between startDate and endDate
 */
exports.findDaysBetweenDates = function (startDate, endDate) {
    return Math.abs(moment(startDate).diff(endDate, 'days'));
};

/**
 * Gets the current Mayer Multiple: the current price divided by the 200 day moving average.
 *
 * @param callback
 * @returns number: current price divided by the 200DMA
 */
exports.getMayerMultiple = function (callback) {
    this.get200DayMovingAverage('BTC-USD', (avg) => {
        this.getCurrentPrice('BTC-USD', (currentPrice) => {
            callback(currentPrice / avg);
        })
    })
};
