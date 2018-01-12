const dbAccess = require('./dbaccess');
const crypto = require('crypto');
const alertParser = require('./libs/alertParser');

class User {
    constructor(emailAddress) {
        this.emailAddress = emailAddress;
    }

    /**
     * Create a new User in the database.
     * @param emailAddress: string:     User's email address (username)
     * @param password: string:         User's password
     */
    static create(emailAddress, password) {
        return new Promise((resolve) => {
            User.createPasswordSaltAndHash(password)
            .then((salt, hash) => {
                dbAccess.createUser(emailAddress, salt, hash, (res) => {
                    resolve();
                });
            })
        })
    }

    /**
     * Find a user if they exist. Otherwise throw an error.
     *
     * @param emailAddress: string:     User's email address (username)
     * @returns {Promise<*>}            Promise which resolves with the constructed User object if the User exists.
     */
    static async find(emailAddress) {
        try {
            const user = new User(emailAddress);
            return await user.init();
        } catch (err) {
            throw(err);
        }
    };


    /**
     *  Create a hash from the user's password entry value and stored salt.
     *
     * @param enteredPassword: string:  Password as submitted for the login attempt.
     * @param salt: buffer:             Hashed password salt (stored in the User's DB record.)
     * @returns {Promise<*>}            Promise which resolves with the hash of the entered password after the User's salt has been applied.
     */
    static createPasswordAttemptHash(enteredPassword, salt) {
        return new Promise((resolve, reject) => {
            crypto.pbkdf2(enteredPassword, salt, 100000, 64, 'sha512', (err, attemptHash) => {
                if (err) reject(err);
                resolve(attemptHash);
            })
        })
    };

    /**
     * Create a password salt and hash to store in the User's record so that the password itself is not stored.
     *
     * @param password: string: User's password
     * @returns {Promise<*>}    Promise which resolves with the password salt and hash, to be stored in the User's record.
     */
    static createPasswordSaltAndHash(password) {
        return new Promise((resolve) => {
            const salt = crypto.randomBytes(64);
            crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, hash) => {
                resolve(salt, hash);
            })
        })
    };

    /**
     * Check a number of alerts for syntactic validity.
     *
     * @param alerts: array of Alerts:  Alerts to be checked for validity.
     * @returns {Promise<*>}            Promise which resolves with nothing if all alerts within 'alerts' were indeed valid.
     */
    static async checkAlertsValidity (alerts) {
        try {
            return await alertParser.checkAlertsValidity(alerts);
        } catch (err) {
            throw err;
        }
    };
}

/**
 * Attempt to log this User in with the provided password.
 *
 * @param attemptPass: string: Password provided for this login attempt. May not be a valid passsword.
 */
User.prototype.attemptLogin = async function (attemptPass) {
    try {
        const attemptHash = await User.createPasswordAttemptHash(attemptPass, this.salt.buffer);
        if (Buffer.compare(attemptHash, this.hash.buffer) === 0) {  // password matched
            return 'password ok';
        } else {
            throw new Error('bad password');
        }
    } catch (err) {
        throw err;
    }
};

User.prototype.setUpdates = function (values) {
    return new Promise ((resolve, reject) => {
        dbAccess.updateUser({emailAddress: this.emailAddress}, {$set: {updates: values} }, (updatedUserDoc) => {
            // reflect changes to DB doc in local User object
            this.updates = updatedUserDoc.value.updates;
            resolve(this);
        })
    })
};

User.prototype.setAlerts = function (values) {
    return new Promise((resolve) => {
        dbAccess.updateUser({emailAddress: this.emailAddress}, {$set: {alerts: values} }, (updatedUserDoc) => {
            // reflect changes to DB doc in local User object
            this.alerts = updatedUserDoc.value.alerts;
            resolve(this);
        })
    })
};

User.prototype.setVerified = function (v) {
    return new Promise((resolve, reject) => {
        dbAccess.updateUser({emailAddress: this.emailAddress}, {$set: {isVerified: v} }, (updatedUserDoc) => {
            this.isVerified = updatedUserDoc.value.isVerified;
            resolve(this);
        });
    })
};

/**
 * Initialize this User by retrieving its record from the database and populating its class members.
 * This function should only ever be invoked by the static User.find method.
 */
User.prototype.init = function () {
    return new Promise((resolve, reject) => {
        dbAccess.findUser({emailAddress: this.emailAddress}, (user) => {
            if (user === null) {
                reject(new Error(`User ${this.emailAddress} does not exist`));
            } else {
                this.salt = user.salt;
                this.hash = user.hash;
                this.alerts = user.alerts;
                this.updates = user.updates;
                this.settings = user.settings;
                this.isVerified = user.isVerified;
                resolve(this);
            }
        })
    })
};

module.exports = User;
