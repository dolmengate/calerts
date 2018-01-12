const apis = require('./apis');
const async = require('async');

// todo add time conditions
// 'within 15 minutes'
// '15 minutes from now'

const SYMBOLS = {
    products: {
        btcusd: 'BTC-USD',
        ltcusd: 'LTC-USD',
        bchusd: 'BCH-USD',
        ethusd: 'ETH-USD'
    },
    comparison: {
        letheq: '<=',
        grtheq: '>=',
        leth: '<',
        grth: '>',
    },
    time: {
        at: '@',
        min: 'min',
        hour: 'hour',
        day: 'day'
    }
};

/**
 * Ensure all of a user's alerts are valid.
 *
 * @param alerts
 */
exports.checkAlertsValidity = function (alerts) {
    return new Promise((resolve, reject) => {
        async.each(alerts, (alert, next) => {
            checkAlert(alert)
                .then(() => {   // alert ok
                    next();
                })
                .catch((err) => { console.log('Alert failed to validate'); reject(err); });
        }, function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(); // alerts ok
            }
        })
    });
};

/**
 * Check that all of an alert's conditions are valid logical expressions
 * // todo send information through error handling about which condition failed (and why?)
 * @param alert
 */
checkAlert = function(alert) {
    return new Promise((resolve, reject) => {
        async.each(alert.conditions, (condition, next) => {
            parseConditionSymbols(condition)
                .then((parsedCondString) => {
                    eval(parsedCondString);
                    next();
                })
                .catch((err) => {
                    reject(err);
                    next();
                })
        }, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        })
    })
};

/**
 * Convert a user Alert Condition into a string representation of a valid logical expression
 *
 * @param condition
 */
parseConditionSymbols = async function (condition) {
    try {
        return replaceOtherSymbols(await replaceProductSymbols(unpackConditionSymbols(condition)));
    } catch (err) {
        throw err;
    }
};

/**
 * Convert an array of Symbols in to an eval-able string
 *
 * @param condition: object: of the format { symbols: [ { type: string, value: string } ] }
 */
unpackConditionSymbols = function(condition) {
    let symbolVals = [];
    condition.symbols.forEach(symbol => {
        symbolVals.push(symbol.value);
    });
    return symbolVals.join('');
};

replaceProductSymbols = function(symbolsString) {
    return new Promise((resolve, reject) => {
        async.eachOf(SYMBOLS.products, (product, productKey, next) => {
                if (symbolsString.includes(productKey)) { // no need to request the price if the symbol isn't in the condition
                    apis.getCurrentPrice(product, (price) => {
                        symbolsString = symbolsString.replace(productKey, price, 'g');
                        next();
                    });
                } else {
                    next();
                }
            }, function (err) {
                if (err) {
                    console.log('Product symbol replacement failed.');
                    reject(err);
                } else {
                    resolve(symbolsString);
                }
        })
    });
};

replaceOtherSymbols = function(symbolsString) {
    const comparisonSymbols = SYMBOLS['comparison'];
    Object.keys(comparisonSymbols).forEach((symbolKey) => {
        symbolsString = symbolsString.replace(symbolKey, comparisonSymbols[symbolKey], 'g');
    });
    return symbolsString;
};

const testUser = {
    alerts: [
        {
            conditions: [
                {
                    symbols: [
                        {
                            value: 'btcusd'
                        },
                        {
                            value: 'grtheq'
                        },
                        {
                            value: 'ltcusd'
                        }
                    ]
                },
                {
                    symbols: [
                        {
                            value: 'ethusd'
                        },
                        {
                            value: 'grth'
                        },
                        {
                            value: '1100'
                        }
                    ]
                }
            ]
        },
        {
            conditions: [
                {
                    symbols: [
                        {
                            value: 'btcusd'
                        },
                        {
                            value: 'grtheq'
                        },
                        {
                            value: 'ltcusd'
                        }
                    ]
                },
                {
                    symbols: [
                        {
                            value: '100'
                        },
                        {
                            value: 'grtheq'
                        },
                        {
                            value: 'letheq'
                        }
                    ]
                }
            ]
        },
    ]
};

// this.checkAlertsValidity(testUser.alerts)
//     .then(() => {
//     console.log();
// }).catch(err => console.log(err));

