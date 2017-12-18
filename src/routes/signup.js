
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


router.get('/confirm/:verificationHash', (req, res) => {

    // set user to verified and deactivate the verification email
    databaseAccess.findEmail({'verify.uvHash' : req.params.verificationHash, 'verify.isActive': true}, (email) => {
        if (email !== null) {
            databaseAccess.updateUser({emailAddress: email.recipientAddress, isVerified: false}, {$set: {isVerified: true} }, (op) => {
                databaseAccess.updateEmail({recipientAddress: email.recipientAddress, 'verify.isActive': true}, {$set: {'verify.isActive': false} }, (op) => {
                    res.send('User ' + email.recipientAddress + ' verified!');
                    // TODO render login page with res.body.newlyVerified === true or something (show message prompting user to login)
                })
            })
        } else {
            res.send('That user verification email has expired.')
        }
    })
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
 * Create a hash digest for the user's verification email.
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
