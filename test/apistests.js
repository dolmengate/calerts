let assert = require('assert');
let moment = require('moment');
let apis = require('../src/libs/apis');

describe('synchronous functions', () => {
    describe('apis.makeCoinbaseSpotPath(currencyPair, date)', () => {
        it('should return a URL of format: ' +
            '/v2/prices/:currencypair/spot?date=:date', () => {
            assert.equal('/v2/prices/BTC-USD/spot?date=2016-02-15',
                apis.makeCoinbaseSpotPath('BTC-USD', '2016-02-15'));
        });
    });

    describe('apis.getAvgPrice(days)', () => {
        it('should return a real of the average price', () => {
            assert.equal(683.1885714285714, apis.getAvgPrice(
                ['514.35', '625.23', '326.93', '853.85', '1059.93', '957.20', '444.83']
            ));
        })
    });

    describe('apis.findDaysBetweenDates', () => {
        it('should return the number of days in the range (inclusive)', () => {
            assert.equal(4,
                apis.findDaysBetweenDates(
                    moment(new Date()).add(-3, 'days').toISOString().slice(0,10),
                    moment(new Date()).add(-7, 'days').toISOString().slice(0,10)
                )
            );
        });
    });
});

// ASYNC //
describe('asynchronous functions', () => {
    describe('apis.getJsonFromApi(hostName, path, callback)', () => {
        it('should retrieve the the price of any currency pair at any time', (done) => {
            apis.getJsonFromApi('api.coinbase.com', '/v2/prices/BTC-USD/spot', (json) => {
                assert.strictEqual(typeof json, typeof {});
                console.log(json);
                done();
            })
        })
    });

    describe('apis.getSpotPrice(currencyPair, date, callback)', () => {
        it('should retrieve the historical price at a certain date ', (done) => {
            apis.getSpotPrice('BTC-USD', '2016-01-01', (amt) => {
                assert.strictEqual(amt, '433.28');
                console.log(amt);
                done();
            })
        })
    });

    describe('apis.getCurrentPrice', () => {
        it('should retrieve the current price', (done) => {
            apis.getCurrentPrice('BTC-USD', (amt) => {
                assert.strictEqual(typeof amt, typeof 0.00);
                console.log(amt);
                done();
            })
        })
    });

    describe('apis.getDailyPricesInRange(currencyPair, startDate, endDate, callback)', () => {
        it('should get a list of prices', (done) => {
            apis.getDailyPricesInRange(
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
            apis.getDailyPricesInRange(
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
            apis.getDailyPricesInRange(
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

    describe('apis.get200DayMovingAverage(currencyPair, callback)', () => {
        it('should get prices and calculate an average', (done) => {
            apis.get200DayMovingAverage('BTC-USD', (amt) => {
                assert.strictEqual(typeof amt, typeof 0.00);
                console.log(amt);
                done();
            })
        })
    });

    describe('apis.getMayerMultiple(callback)', () => {
        it('should get the Mayer Multiple', (done) => {
            apis.getMayerMultiple( (index) => {
                assert.strictEqual(typeof index, typeof 0.00);
                console.log(index);
                done();
            })
        })
    })
});
