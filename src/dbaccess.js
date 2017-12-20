let MongoClient = require('mongodb').MongoClient;
let assert = require('assert');

// Connection url
const DB_URL = 'mongodb://localhost:27017/test';        // USING TEST URL

/**
 *  Users
 *
 * Fields:
 *  emailAddress: string
 *  password: string
 *  settings: object
 *  isVerified: boolean
 */

/*  C R U D   O P E R A T I O N S */

exports.createUser = function(emailAddress, password, callback) {
    connectToCollection(DB_URL, 'users',(db, collection) => {
        collection.insertOne(
            {
                emailAddress,
                password,
                settings: {
                    theme: 'light',
                    currencyPairs: [
                        {
                            pair: 'BTC-USD',
                            updateFrequency: 12,
                        },
                        {
                            pair: 'ETH-USD',
                            updateFrequency: 12,
                        }
                    ]
                },
                isVerified: false
            },
            (err, res) => {
                assert.equal(null, err);
                assert.equal(1, res.result.n);
                assert.equal(1, res.ops.length);
                db.close();
                callback(res);
        });
    })
};

exports.findUser = function(query, callback) {
    connectToCollection(DB_URL, 'users', (db, collection) => {
        collection.findOne( query, (err, doc) => {
            assert.equal(null, err);
            db.close();
            callback(doc);
        });
    })
};

exports.updateUser = function(filter, query, callback) {
    connectToCollection(DB_URL, 'users', (db, collection) => {
        collection.updateOne(filter, query, (err, doc) => {
            assert.equal(null, err);
            assert.equal(1, doc.result.ok);
            assert.equal(1, doc.result.nModified);
            assert.equal(1, doc.result.n);
            db.close();
            callback(doc);
        })
    })
};

exports.deleteUser = function (filter, callback) {
    connectToCollection(DB_URL, 'users', (db, collection) => {
        collection.deleteOne( filter, null, (err, res) => {
            assert.equal(null, err);
            db.close();
            callback(res);
        });
    })
};

/**
 * Emails
 *
 * Fields:
 *  recipientAddress: string
 *  time: number
 *  type: string
 *  verify: object - { isActive: boolean, uvHash: string }
 */

/* C R U D   O P E R A T I O N S */

exports.saveEmail = function(recipientAddress, time, type, verify, callback) {
    connectToCollection(DB_URL, 'emails',(db, collection) => {
        collection.insertOne(
            {
                recipientAddress,
                time,
                type,
                verify
            },
            (err, res) => {
                assert.equal(null, err);
                assert.equal(1, res.result.n);
                assert.equal(1, res.ops.length);
                db.close();
                callback(res);
            });
    })
};

exports.findEmail = function(query, callback) {
    connectToCollection(DB_URL, 'emails', (db, collection) => {
        collection.findOne( query, (err, doc) => {
            assert.equal(null, err);
            db.close();
            callback(doc);
        });
    })
};

exports.updateEmail = function(filter, update, callback) {
    connectToCollection(DB_URL, 'emails', (db, collection) => {
        collection.updateOne(filter, update, (err, res) => {
            assert.equal(null, err);
            db.close();
            callback(res);
        })
    })
};

exports.updateEmails = function(filter, update, callback) {
    connectToCollection(DB_URL, 'emails', (db, collection) => {
        collection.updateMany(filter, update, (err, res) => {
            assert.equal(null, err);
            db.close();
            callback(res);
        })
    })
};

exports.findEmails = function(filter, callback) {
    connectToCollection(DB_URL, 'emails', (db, collection) => {
        collection.find().filter(filter).toArray((err, docs) => {
            assert.equal(null, err);
            db.close();
            callback(docs);
        })
    })
};


/**
 * btcusdHistoricalData - one data point per day (the opening price)
 *
 * Fields:
 *  time: number
 *  low: number
 *  high: number
 *  open: number
 *  close: number
 *  volume: number
 */

/* C R U D    O P E R A T I O N S */

exports.addBtcUsdHistoricalDataPoints = function(days, callback) {
    connectToCollection(DB_URL, 'btcusdHistorical', (db, collection) => {
        collection.insertMany(days, (err, res) => {
            assert.equal(null, err);
            db.close();
            callback(res);
        })
    })
};

/* D A T A B A S E   U T I L I T Y   F U N C T I O N S */

connectToCollection = function(DB_URL, coll, callback) {
    MongoClient.connect(DB_URL, (err, db) => {
        assert.equal(null, err);
        console.log('Connected to mongodb server on ' + DB_URL + ' for collection ' + coll);

        callback(db, db.collection(coll));
    });
};
