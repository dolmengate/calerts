let assert = require('assert');
let moment = require('moment');
let app = require('../src/app.js');
let https = require('https');

describe('synchronous', () => {
    describe('app.makeSpotUrl(currencyPair, date)', () => {
        it('should return a URL of format: ' +
            'https://api.coinbase.com/v2/prices/:currencypair/spot?date=:date', () => {
            assert.equal('https://api.coinbase.com/v2/prices/BTC-USD/spot?date=2016-02-15',
                app.makeSpotUrl('BTC-USD', '2016-02-15'));
        });
    });

    describe('app.getAvgPrice(days)', () => {
        it('should return a real of the average price', () => {
            assert.equal(683.1885714285714, app.getAvgPrice(
                [
                    {date: '2016-01-01', price: '514.35' },
                    {date: '2016-01-01', price: '625.23' },
                    {date: '2016-01-01', price: '326.93' },
                    {date: '2016-01-01', price: '853.85' },
                    {date: '2016-01-01', price: '1059.93' },
                    {date: '2016-01-01', price: '957.20' },
                    {date: '2016-01-01', price: '444.83' }
                ]
            ));
        })
    });

    describe('app.findDaysBetweenDates', () => {
        it('should return the number of days in the range (inclusive)', () => {
            assert.equal(4,
                app.findDaysBetweenDates(
                    moment(new Date()).add(-3, 'days').toISOString().slice(0,10),
                    moment(new Date()).add(-7, 'days').toISOString().slice(0,10)
                )
            );
        });
    });
});

// ASYNC //
describe('asynchronous', () => {
    describe('app.getPriceFromApi(url, callback)', () => {
        it('should retrieve the the price of any currency pair at any time', (done) => {
            app.getPriceFromApi('https://api.coinbase.com/v2/prices/BTC-USD/spot', (amt) => {
                assert.strictEqual(typeof amt, typeof '0.00');
                console.log(amt);
                done();
            })
        })
    });

    describe('app.getSpotPrice(currencyPair, date, callback)', () => {
        it('should retrieve the historical price at a certain date ', (done) => {
            app.getSpotPrice('BTC-USD', '2016-01-01', (amt) => {
                assert.strictEqual(amt, '433.28');
                console.log(amt);
                done();
            })
        })
    });

    describe('app.getCurrentPrice', () => {
        it('should retrieve the current price', (done) => {
            app.getCurrentPrice('BTC-USD', (amt) => {
                assert.strictEqual(typeof amt, typeof '0.00');
                console.log(amt);
                done();
            })
        })
    });

    describe('app.getDailyPricesInRange(currencyPair, startDate, endDate, callback)', () => {
        it('should get a list of prices', (done) => {
            app.getDailyPricesInRange(
                'BTC-USD',
                moment(new Date()).add(-500, 'days').toISOString().slice(0, 10),
                moment(new Date()).add(-498, 'days').toISOString().slice(0, 10),
                (prices) => {
                    assert.deepStrictEqual(typeof prices, typeof [{}]);
                    console.log(prices);
                    done();
                })
        });

        it('should get a list of prices', (done) => {
            app.getDailyPricesInRange(
                'BTC-USD',
                moment(new Date()).add(-5, 'days').toISOString().slice(0, 10),
                moment(new Date()).add(-1, 'days').toISOString().slice(0, 10),
                (prices) => {
                    assert.deepStrictEqual(typeof prices, typeof [{}]);
                    console.log(prices);
                    done();
                })
        });

        it('should get a list of prices', (done) => {
            app.getDailyPricesInRange(
                'BTC-USD',
                moment(new Date()).add(-4, 'days').toISOString().slice(0, 10),
                moment(new Date()).add(0, 'days').toISOString().slice(0, 10),
                (prices) => {
                    assert.deepStrictEqual(typeof prices, typeof [{}]);
                    console.log(prices);
                    done();
                })
        });
    });

    describe('app.get200DayMovingAverage(currencyPair, callback)', () => {
        it('should get prices and calculate an average', (done) => {
            app.get200DayMovingAverage('BTC-USD', (amt) => {
                assert.strictEqual(typeof amt, typeof 0.00);
                console.log(amt);
                done();
            })
        })
    })
});
