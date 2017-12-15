
const express = require('express');
const router = express.Router();
const sendmail = require('../libs/sendmail');
const db = require('../db');

// let userVerificationHash = 0;

router.get('/', (req, res) => {
    res.render('signup');
});

router.post('/', (req, res) => {

    // TODO create hash to use as confirmation email param
    // TODO generate confirmation URL with user hash
    sendmail.send(
        'calertsverify@sroman.info',
        'Please verify your email',
        req.body.emailAddress,
        'message here',
        () => {
            db.createUser(req.body.emailAddress, req.body.password, (res) => {
                console.log(res);
                console.log('User created');
            });
        });
});

router.post('/confirm', (req, res) => {
    // req.url ?

    // TODO confirm verification hash sent in URL matches userVerificationHash
    // let emailAddress = email pulled from verification hash?
    // if url encoded hash === userVerificationHash
    // db.updateUser({emailAddress: emailAddress}, { $set: {isVerified: true}}, (res) => {
    //   console.log(res);
    //};
});

module.exports = router;
