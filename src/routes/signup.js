
const express = require('express');
const router = express.Router();
const sendmail = require('../libs/sendmail');
const db = require('../db');

// let userVerificationHash = 0;

router.get('/', (req, res) => {
    res.render('signup');
});

//     TODO create hash to use as confirmation email param
//     TODO generate confirmation URL with user hash
//     TODO deactivate any verification emails previously sent before sending a new one
router.post('/', (req, res) => {

    db.findUser({emailAddress: req.body.emailAddress}, (user) => {

        if (user !== null) {
            if (user.isVerified === true) {
                res.send('User already exists.');   // user exists and is verified
            } else {
                res.sendStatus(200);
                sendUserVerificationEmail();        // user exists but is not verified (send a new verification email)
            }
        } else {
            res.sendStatus(200);
            sendUserVerificationEmail();            // user does not exist

            db.createUser(req.body.emailAddress, req.body.password, (res) => {
                console.log('User ' + req.body.emailAddress + ' created');
            });
        }
    });

    let sendUserVerificationEmail = function () {
        sendmail.send(
            'calertsverify@sroman.info',
            'Please verify your email',
            req.body.emailAddress,
            'MESSAGE AND VERIFICATION LINK HERE',
            'verification',
            function () {
                console.log('Verification email sent to user ' + req.body.emailAddress);
            });
    };
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
