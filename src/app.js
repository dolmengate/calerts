let https = require('https');

/**
 * Build the URL string for a GET request to the Coinbase spot price endpoint.
 * @param currencyPair  string of the currency to convert from and to of the format TCU-FCU
 * @param date          string of the date of format YYYY-MM-DD (UTC)
 */
exports.makeSpotUrl = function makeSpotUrl(currencyPair, date) {
    return `https://api.coinbase.com/v2/prices/${currencyPair}/spot?date=${date}`;
};

/**
 * Make the GET request to the spot price API and return the resulting price data.
 * @param currencyPair string of the currency pair of the format BAS-CUR
 * @param date         string of the date of the format YYYY-MM-DD (months are NOT zero indexed as with Date)
 * @param callback     function to do something with the amount retrieved
 */
exports.getSpotPrice = function (currencyPair, date, callback) {
    https.get(this.makeSpotUrl(currencyPair, date), (res) => {
        res.on('data', (bin) => {
            let amt = JSON.parse(bin).data.amount;
            callback(amt);
        })
    }).on('error', (err) => {console.log(err);});
};

/**
 * Return a list of prices (one price per day) for the given year
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
                prices.push(amt);

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
 * @param priceList     the list of prices to average
 */
exports.getAvgFromRange = function (priceList) {

};
