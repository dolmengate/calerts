const apis = require('./apis');
const async = require('async');

// todo add time conditions
// 'in 15 minutes'
// '15 minutes from now'

const symbols = {
    products: {
        btcusd: 'BTC-USD',
        ltcusd: 'LTC-USD',
        bchusd: 'BCH-USD',
        ethusd: 'ETH-USD'
    },
    comparison: {
        lte: '<=',
        gte: '>=',
        lt: '<',
        gt: '>',
        eq: '=',
        in: 'in'
    },
    logical: {
        and: '&&',
        or: '||',
        not: '!'
    },
    time: {
        at: '@',
        min: 'min',
        hour: 'hour',
        day: 'day'
    }
};

exports.parseSymbols = function (alert) {
    return new Promise((resolve) => {
        replaceProductSymbols(alert).then((alert) => {
            resolve(replaceOtherSymbols(alert));
        });
    });
};

function replaceProductSymbols(string) {
    const products = symbols.products;
    return new Promise((resolve, reject) => {
        async.eachOf(products, (prod, prodKey, next) => {
            if (string.includes(prodKey)){
                getProductPrice(prod)
                    .then((price) => {
                        string = string.replace(prodKey, price, 'g');
                        next();
                    });
            } else {
                next();
            }
        }, function (err) {
            if (err) {
                reject(err)
            } else {
                resolve(string)
            }
        });
    })
}

function replaceOtherSymbols(alert) {
    let syms = symbols['comparison'];
    for (let symKey in syms) {
        if (syms.hasOwnProperty(symKey)) {
            alert = alert.replace(symKey, syms[symKey], 'g');
        }
    }

    syms = symbols['logical'];
    for (let symKey in syms) {
        if (syms.hasOwnProperty(symKey)) {
            alert = alert.replace(symKey, syms[symKey], 'g');
        }
    }
    return alert;
}


function getProductPrice(product) {
    return new Promise((resolve) => {
        apis.getCurrentPrice(product, (price) => {
            resolve(price);
        })
    })
}
