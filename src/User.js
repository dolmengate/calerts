const dbAccess = require('./dbaccess');
const crypto = require('crypto');

class User {
    constructor(emailAddress) {
        this.emailAddress = emailAddress;
    }

    static create(emailAddress, salt, hash, callback) {
        dbAccess.createUser(emailAddress, salt, hash, (res) => {
            callback();
        });
    }

    static find(email, callback) {
       new User(email).init((err, constructedUser) => {
           if (err) {
               callback(err);
           } else {
               callback(null, constructedUser);
           }
       })
    };

    /**
     *  Create a hash from the user's password entry value and stored salt.
     *
     */
    static createPasswordAttemptHash(enteredPassword, salt, callback) {
        crypto.pbkdf2(enteredPassword, salt, 100000, 64, 'sha512', (err, attemptHash) => {
            callback(attemptHash);
        })
    };
}

User.prototype.attemptLogin = function (attemptPass, callback) {
    User.createPasswordAttemptHash(attemptPass, this.salt.buffer, (attemptHash) => {
        if (Buffer.compare(attemptHash, this.hash.buffer) === 0) {  // password matched
            callback(null, true)
        } else {
            callback(new Error('Login attempt failed - wrong password'))
        }
    })
};

User.prototype.setUpdates = function (values, callback) {
    dbAccess.updateUser({emailAddress: this.emailAddress}, {$set: {updates: values} }, (updatedUserDoc) => {
        // reflect changes to DB doc in local User object
        this.updates = updatedUserDoc.value.updates;
        callback(this);
    })
};

User.prototype.setVerified = function (v, callback) {
    dbAccess.updateUser({emailAddress: this.emailAddress}, {$set: {isVerified: v} }, (updatedUserDoc) => {
        this.isVerified = updatedUserDoc.value.isVerified;
        callback(this);
    });
};

User.prototype.init = function (callback) {
    dbAccess.findUser({emailAddress: this.emailAddress}, (user) => {
        if (user === null) {
            callback(new Error(`User ${this.emailAddress} does not exist`));
        } else {
            this.salt = user.salt;
            this.hash = user.hash;
            this.alerts = user.alerts;
            this.updates = user.updates;
            this.settings = user.settings;
            this.isVerified = user.isVerified;
            callback(null, this);
        }
    })
};

module.exports = User;
