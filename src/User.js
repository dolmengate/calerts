const dbAccess = require('./dbaccess');

// TODO promised based getters, setters, create and init funcs

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

User.prototype.setUpdates = function (values, callback) {
    dbAccess.updateUser({emailAddress: this.emailAddress}, {$set: {updates: values} }, (updatedUserDoc) => {
        // reflect changes to DB doc in local User object
        this.alerts = updatedUserDoc.value.alerts;
        this.updates = updatedUserDoc.value.updates;
        callback(updatedUserDoc);
    })
};

User.prototype.setVerified = function (v, callback) {
    dbAccess.updateUser({emailAddress: this.emailAddress}, {$set: {isVerified: v} }, (updatedUserDoc) => {
        this.isVerified = updatedUserDoc.value.isVerified;
        callback(updatedUserDoc);
    });
};

User.prototype.init = function (callback) {
    dbAccess.findUser({emailAddress: this.emailAddress}, (user) => {
        this.salt = user.salt;
        this.hash = user.hash;
        this.alerts = user.alerts;
        this.updates = user.updates;
        this.settings = user.settings;
        this.isVerified = user.isVerified;
        callback();
    })
};

module.exports = User;
