let MongoClient = require('mongodb').MongoClient;
let assert = require('assert');

// Connection url
const url = 'mongodb://localhost:27017/calerts';


/* U S E R S   -   C R U D   O P E R A T I O N S */
/**
 * Index: emailAddress (unique)
 */

exports.createUser = function(emailAddress, password, callback) {
    connectToCollection(url, 'users',(db, collection) => {
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
    connectToCollection(url, 'users', (db, collection) => {
        collection.findOne( queryObject, (err, doc) => {
            assert.equal(null, err);
            db.close();
            callback(doc);
        });
    })
};

exports.updateUser = function(filterObject, queryObject, callback) {
    connectToCollection(url, 'users', (db, collection) => {
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
    connectToCollection(url, 'users', (db, collection) => {
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
 */

saveEmail = function(recipientAddress, date, email, callback) {
    connectToCollection(url, 'emails',(db, collection) => {
        collection.insertOne(
            {
                recipientAddress,
                date,
                email
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

findEmail = function(queryObject, callback) {
    connectToCollection(url, 'emails', (db, collection) => {
        collection.findOne( queryObject, (err, doc) => {
            assert.equal(null, err);
            db.close();
            callback(doc);
        });
    })
};


/* D A T A B A S E   U T I L I T Y   F U N C T I O N S */

connectToCollection = function(url, coll, callback) {
    MongoClient.connect(url, (err, db) => {
        assert.equal(null, err);
        console.log('Connected to mongodb server on ' + url);

        callback(db, db.collection(coll));
    });
};
