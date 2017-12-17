let MongoClient = require('mongodb').MongoClient;
let assert = require('assert');

// Connection url
const DB_URL = 'mongodb://localhost:27017/test';        // USING TEST URL

/**
 * TODO start seeding historical data into the db in new collection btcusdHistorical
 *
 * Index: emailAddress (unique)
 *
 * Fields:
 *  emailAddress
 *  password
 *  updateFrequency
 *  currencyPairs
 *  isVerified
 */

/* U S E R S   -   C R U D   O P E R A T I O N S */

exports.createUser = function(emailAddress, password, callback) {
    connectToCollection(DB_URL, 'users',(db, collection) => {
        collection.insertOne(
            {
                emailAddress,
                password,
                updateFrequency: 0,
                currencyPairs: ['BTC-USD'],
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
 * Indexes: recipientAddress, date (compound, unique)
 *
 * Fields:
 *  recipientAddress
 *  date
 *  email
 *  type
 *  isActive
 */

/* E M A I L S   -   C R U D   O P E R A T I O N S */

exports.saveEmail = function(recipientAddress, time, email, type, isActive, callback) {
    connectToCollection(DB_URL, 'emails',(db, collection) => {
        collection.insertOne(
            {
                recipientAddress,
                time,
                email,
                type,
                isActive
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

/* D A T A B A S E   U T I L I T Y   F U N C T I O N S */

connectToCollection = function(DB_URL, coll, callback) {
    MongoClient.connect(DB_URL, (err, db) => {
        assert.equal(null, err);
        console.log('Connected to mongodb server on ' + DB_URL + ' for collection ' + coll);

        callback(db, db.collection(coll));
    });
};
