db.createCollection('users');
// db.users.createIndex({'emailAddress': 1}, {'unique': true});

db.createCollection('emails');
// db.emails.createIndex({'recipientAddress': 1, 'date': 1}, {'unique': true});

db.createCollection('btcusdHistorical');
// db.btcusdHistorical.createIndex({'date': 1}, {'unique': true});
