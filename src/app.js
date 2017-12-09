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
    this.getJSONFromApi(this.makeSpotUrl(currencyPair, date), (json) => {
        callback(json.data.amount);
    })
};

/**
 * Return a list of days for the given year with the associated price
 * The order of the list is not guaranteed to be chronological
 *
 * @param currencyPair: string:         currency pair of the format TCU-FCU
 * @param year: string:                 year to get prices for
 * @param callback: function:
 * @returns days: list of objects:      object for each day of the format {date, price}
 */
exports.getDailyPricesForHistoricalYear = function (currencyPair, year, callback) {

    let days = [];
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
                days.push({date: parsedDate, price: amt});

                // only invoke callback if all the requests are complete
                if (--daysRemaining === 0)
                    callback(days);
            });
        }
    });
};

/**
 * Return a list of days in the given range (inclusive) and their associated prices
 *
 * @param currencyPair: string:         currencies to convert from and to of the format TCU-FCU
 * @param startDate: string:            string of the date to start on of the format YYYY-MM-DD
 * @param endDate: string:              string of the date to end on of the format YYYY-MM-DD
 * @param callback: function:
 * @returns days: list of objects:    object for each day of the format {date, price}
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
 * @param prices: list of numbers:    prices to average
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
        (days) => {
            let prices = [];
            days.forEach( (day) => {
                prices.push(day.price);
            });
            callback(this.getAvgPrice(prices));
    })
};

/**
 *
 * @param callback
 */
exports.getMayerIndex = function (callback) {
    this.get200DayMovingAverage('BTC-USD', (avg) => {
        this.getCurrentPrice('BTC-USD', (currentPrice) => {
            callback(currentPrice / avg);
        })
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
