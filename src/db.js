let MongoClient = require('mongodb').MongoClient;
let assert = require('assert');

// Connection url
const url = 'mongodb://localhost:27017/calerts';

createUser = function(emailAddress, password, callback) {
    connectToCollection(url, 'users',(db, collection) => {
        collection.insertOne(
            {
                emailAddress,
                password,
                updateFrequency: 0,
                currencyPairs: ['BTC-USD']
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

findUser = function(queryObject, callback) {
    connectToCollection(url, 'users', (db, collection) => {
        collection.findOne( queryObject, (err, doc) => {
            assert.equal(null, err);
            assert.equal(1, doc.length);
            db.close();
            callback(doc);
        });
    })
};

updateUser = function(filterObject, queryObject, callback) {
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

deleteUser = function (filterObject, callback) {
    connectToCollection(url, 'users', (db, collection) => {
        collection.deleteOne( filterObject, null, (err, res) => {
            assert.equal(null, err);
            db.close();
            callback(res);
        });
    })
};

connectToCollection = function(url, coll, callback) {
    MongoClient.connect(url, (err, db) => {
        assert.equal(null, err);
        console.log('Connected to mongodb server on ' + url);

        callback(db, db.collection(coll));
    });
};
