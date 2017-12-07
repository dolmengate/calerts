let https = require('https');

/**
 * Gets the current price for the given currency pair
 * @param currencyPair string of the currency to convert from and to of the format TCU-FCU
 * @param callback
 */
exports.getCurrentPrice = function (currencyPair, callback) {
    this.getPriceFromApi(this.getSpotPrice(currencyPair, this.getTodaysDate(), (amt) => {
        callback(amt);
    }))
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
exports.getDailyPricesForYear = function (currencyPair, year, callback) {

    const months = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    let prices = [];
    let daysRemaining = 365;

    months.forEach((daysInMonth, i) => {
        // ensure the month is 2 digits long and is not zero indexed
        let iAsMonth = (i < 9) ? '0' + (i + 1) : i + 1;
        for (let day = 1; day <= daysInMonth; day++) {
            // ensure the day is 2 digits long
            let parsedDay = (day.toString().length === 2) ? day : '0' + day;
            this.getSpotPrice(currencyPair, `${year}-${iAsMonth}-${parsedDay}`, (amt) => {
                prices.push({date: `${year}-${iAsMonth}-${parsedDay}`, price: amt});

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
 * @param frequency
 * @param callback
 */
exports.getDailyPricesForRange = function (currencyPair, startDate, endDate, frequency, callback) {

};

/**
 * Return the average of the prices in a given list of prices
 * @param days the list of prices to average
 *
 */
exports.getAvgFromDayRange = function (days) {
    let total = Object.keys(days).length;
    let sum = 0;

    days.forEach((day) => {
        sum += Number(day.price);
    });

    return sum / total;
};

/**
 * Returns a string of today's date of the format YYYY-MM-DD
 * Months are NOT zero indexed
 * @returns string of the current date of the format YYYY-MM-DD
 */
exports.getTodaysDate = function () {
    return new Date().toISOString().slice(0, 10);
};

