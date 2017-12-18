
const express = require('express');
const router = express.Router();
const sendmail = require('../libs/sendmail');
const databaseAccess = require('../dbaccess');
const crypto = require('crypto');

router.get('/', (req, res) => {
    res.render('signup');
});

router.post('/', (req, res) => {

    databaseAccess.findUser({emailAddress: req.body.emailAddress}, (user) => {

        if (user !== null) {
            if (user.isVerified === true) {
                res.send('User already exists.');                   // user exists and is verified
            } else {
                res.sendStatus(200);
                sendUserVerificationEmail(req.body.emailAddress);   // user exists but is not verified (send a new verification email)
            }
        } else {
            res.sendStatus(200);
            sendUserVerificationEmail(req.body.emailAddress);       // user does not exist

            databaseAccess.createUser(req.body.emailAddress, (res) => {
                console.log('User ' + req.body.emailAddress + ' created');
            });
        }
    });
});

router.post('/confirm/:uvhash', (req, res) => {
    // req.params.uvhash

    // TODO confirm verification hash sent in URL matches userVerificationHash
    // let emailAddress = stored user verification hash
    // if url encoded hash === userVerificationHash
    // databaseAccess.updateUser({emailAddress: emailAddress}, { $set: {isVerified: true}}, (res) => {
    //   console.log(res);
    //};
});


/**
 * Send an email to the user to verify their account.
 *
 * @param userEmail: string:    the email of the user whose account must be verified
 */
sendUserVerificationEmail = function (userEmail) {
    createUserVerificationHash(userEmail, (uvHash) => {
        const baseUrl = 'http://www.sroman.info/calerts/signup/confirm/';

        sendmail.send(
            'calertsverify@sroman.info',
            'Please verify your email',
            userEmail,
            'Click this link to verify your email address: ' + baseUrl + uvHash,
            uvHash,
            'verification',
            function () { console.log('Verification email sent to user ' + userEmail); }
        )
    })
};

/**
 * Create a user verification email that cannot be guessed by those who know the user's email address.
 *
 * @param userEmail: string:    the email of the user whose account must be verified
 * @param callback
 * @returns                     a unique hash digest to create the user verification link to be emailed to the unverified user
 */
createUserVerificationHash = function (userEmail, callback) {
    const hash = crypto.createHash('sha256');

    hash.update(userEmail + new Date()); // this could be anything
    callback(hash.digest('hex'));
};

module.exports = router;
