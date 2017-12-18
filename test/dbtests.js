const assert = require('assert');
const databaseAccess = require('../src/dbaccess');
const MongoClient = require('mongodb').MongoClient;

const DB_TEST_URL = 'mongodb://localhost:27017/test';

// begin tests
describe('database CRUD operations', () => {
    describe('databaseAccess.createUser(emailAddress, callback)', () => {
        it('should add a new user to the db', (done) => {
            prepareTestDb(() => {
                // create a test user
                databaseAccess.createUser('test@test.com', () => {
                    MongoClient.connect(DB_TEST_URL, (err, db) => {
                        assert.equal(null, err);
                        const users = db.collection('users');
                        users.findOne({emailAddress: 'test@test.com'}, (err, user) => {
                            assert.equal('test@test.com', user.emailAddress);
                            assert.equal(null, user.password);
                            assert.equal(0, user.updateFrequency);
                            // assert.equal(['BTC-USD'], user.currencyPairs); [] != []?
                            assert.equal(false, user.isVerified);
                            db.close();
                            done();
                        })
                    })
                })
            })
        });
    });

    describe('databaseAccess.saveEmail(recipientAddress, time, type, verify, callback)', () => {
        it('should save an email to the db', (done) => {
            prepareTestDb(() => {
                // create a test user
                databaseAccess.saveEmail(
                    'test@test.com',
                    new Date().getTime(),
                    'verification',
                    {isActive: true, uvHash: 'slkdjlkjdffk'},
                    function () {
                        MongoClient.connect(DB_TEST_URL, (err, db) => {
                            assert.equal(null, err);
                            const emails = db.collection('emails');
                            emails.findOne({recipientAddress: 'test@test.com'}, (err, email) => {
                                assert.equal('test@test.com', email.recipientAddress);
                                assert.equal(typeof 1234567899, typeof email.time);
                                assert.equal('verification', email.type);
                                assert.deepEqual({isActive: true, uvHash: 'slkdjlkjdffk'}, email.verify);
                                db.close();
                                done();
                            })
                        })
                })
            })
        });
    });

    describe('databaseAccess.updateEmail(filter, update, callback)', () => {
        it('should update an existing email in the db', (done) => {
            prepareTestDb(() => {

                // insert an email to test
                MongoClient.connect(DB_TEST_URL, (err, db) => {
                    assert.equal(null, err);
                    const emails = db.collection('emails');
                    emails.insertOne(
                        {
                            recipientAddress: 'test@test.com',
                            time: new Date().getTime(),
                            type: 'verification',
                            verify: {isActive: true, uvHash: 'sldkjfaslkdffsjd'}
                        },
                        function (err, res) {
                            assert.equal(null, err);

                            // perform the update
                            databaseAccess.updateEmail({recipientAddress: 'test@test.com'}, {$set: { 'verify.isActive': false} }, (res) => {
                                emails.findOne({recipientAddress: 'test@test.com', 'verify.isActive': false}, (err, doc) => {

                                    // do tests
                                    assert.equal(null, err);
                                    assert.equal('test@test.com', doc.recipientAddress);
                                    assert.equal(typeof 1234567899, typeof doc.time);
                                    assert.equal('verification', doc.type);
                                    assert.equal('sldkjfaslkdffsjd', doc.verify.uvHash);
                                    assert.equal(false, doc.verify.isActive);
                                    db.close();
                                    done();
                                });
                            });
                        })
                })
            })
        })
    });

    describe('databaseAccess.updateEmails(filter, update, callback)', () => {
        it('should update all specified existing emails in the db', (done) => {
            prepareTestDb(() => {

                // insert an email to test
                MongoClient.connect(DB_TEST_URL, (err, db) => {
                    assert.equal(null, err);
                    const emails = db.collection('emails');
                    emails.insertMany(
                        [
                            {
                                recipientAddress: 'him@test.com',
                                time: new Date().getTime(),
                                type: 'verification',
                                verify: {isActive: true, uvHash: 'sldkjfaslkdffsjd'}
                            },
                            {
                                recipientAddress: 'me@test.com',
                                time: new Date().getTime(),
                                type: 'verification',
                                verify: {isActive: true, uvHash: 'sldkjfaslkdffsjd'}
                            },
                            {
                                recipientAddress: 'you@test.com',
                                time: new Date().getTime(),
                                type: 'scheduled-alert',
                                verify: {isActive: null, uvHash: null}
                            }
                        ],
                        function (err, res) {
                            assert.equal(null, err);

                            // perform the updates
                            databaseAccess.updateEmails({'verify.isActive': true}, {$set: { 'verify.isActive': false} }, (res) => {
                                emails.find().toArray((err, docs) => {

                                    // do tests
                                    assert.equal(false, docs[0].verify.isActive);
                                    assert.equal(false, docs[1].verify.isActive);
                                    assert.equal(null, docs[2].verify.isActive);
                                    db.close();
                                    done();
                                });
                            });
                        })
                })
            })
        })
    });
});

function prepareTestDb(callback) {

    MongoClient.connect(DB_TEST_URL, (err, db) => {
        assert.equal(null, err);

        db.dropCollection('users', () => {
            db.dropCollection('emails', () => {
                db.dropCollection('btcusdHistorical', () => {
                    db.createCollection('users', () => {
                        db.createCollection('emails', () => {
                            db.createCollection('btcusdHistorical', () => {
                                const users = db.collection('users');
                                const emails = db.collection('emails');
                                const btcusdHistorical = db.collection('btcusdHistorical');

                                users.createIndex({'emailAddress': 1}, {'unique': true}, () => {
                                    emails.createIndex({'recipientAddress': 1, 'date': 1}, {'unique': true}, () => {
                                        btcusdHistorical.createIndex({'time': 1}, {'unique': true}, () => {
                                            db.close();
                                            callback();
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}
