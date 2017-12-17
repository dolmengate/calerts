let MongoClient = require('mongodb').MongoClient;
let assert = require('assert');

// Connection url
const DB_URL = 'mongodb://localhost:27017/test';        // USING TEST URL

// TODO start seeding historical data into the db in new collection btcusdHistorical

/* U S E R S   -   C R U D   O P E R A T I O N S */
/**
 * Index: emailAddress (unique)
 *
 * Fields:
 *  emailAddress
 *  password
 *  updateFrequency
 *  currencyPairs
 *  isVerified
 */

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

exports.findUser = function(queryObject, callback) {
    connectToCollection(DB_URL, 'users', (db, collection) => {
        collection.findOne( queryObject, (err, doc) => {
            assert.equal(null, err);
            db.close();
            callback(doc);
        });
    })
};

exports.updateUser = function(filterObject, queryObject, callback) {
    connectToCollection(DB_URL, 'users', (db, collection) => {
        collection.updateOne(filterObject, queryObject, (err, doc) => {
            assert.equal(null, err);
            assert.equal(1, doc.result.ok);
            assert.equal(1, doc.result.nModified);
            assert.equal(1, doc.result.n);
            db.close();
            callback(doc);
        })
    })
};

exports.deleteUser = function (filterObject, callback) {
    connectToCollection(DB_URL, 'users', (db, collection) => {
        collection.deleteOne( filterObject, null, (err, res) => {
            assert.equal(null, err);
            db.close();
            callback(res);
        });
    })
};



/* E M A I L S   -   C R U D   O P E R A T I O N S */
/**
 * Indexes: recipientAddress, date (compound, unique)
 *
 * Fields
 *  recipientAddress
 *  date
 *  email
 *  type
 *  isActive
 */

exports.saveEmail = function(recipientAddress, date, email, type, callback) {
    connectToCollection(DB_URL, 'emails',(db, collection) => {
        collection.insertOne(
            {
                recipientAddress,
                date,
                email,
                type
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

exports.findEmail = function(queryObject, callback) {
    connectToCollection(DB_URL, 'emails', (db, collection) => {
        collection.findOne( queryObject, (err, doc) => {
            assert.equal(null, err);
            db.close();
            callback(doc);
        });
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
