const dbAccess = require('./dbaccess');

class User {
    constructor(emailAddress) {
        this.emailAddress = emailAddress;
    }

    static create(emailAddress, salt, hash, callback) {
        dbAccess.createUser(emailAddress, salt, hash, (res) => {
            callback();
        });
    }
}

User.prototype.setUpdateTimes = function (currencyPair, values, callback) {
    let cp = currencyPair.toLowerCase().split('-').join('');
    dbAccess.updateUser({emailAddress: this.emailAddress}, {$set: { [`settings.currencyPairs.${cp}.updateTimes`]: values} }, (userDoc) => {
        // reflect changes to DB doc in local User object
        this.settings = userDoc.value.settings;
        callback(userDoc);
    })
};

User.prototype.setVerified = function (v, callback) {
    dbAccess.updateUser({emailAddress: this.emailAddress}, {$set: {isVerified: v} }, (userDoc) => {
        this.isVerified = userDoc.value.isVerified;
        callback(userDoc);
    });
};


User.prototype.getCurrencyPairs = function () {
    return this.settings.currencyPairs;
};

User.prototype.init = function (callback) {
    dbAccess.findUser({emailAddress: this.emailAddress}, (user) => {
        this.salt = user.salt;
        this.hash = user.hash;
        this.settings = user.settings;
        this.alerts = user.alerts;
        this.isVerified = user.isVerified;
        callback();
    })
};


// let userObject = new User('help@me.com');
// userObject.init(() => {
//     userObject.setUpdateTimes('BTC-USD', [{hour: 2, minutes: 2}], (doc) => {
//         console.log();
//     })
// });

module.exports = User;
