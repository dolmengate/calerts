const router = require('express').Router();
const dbAccess = require('../dbaccess');
const crypto = require('crypto');
const User = require('../User');
const sendmail = require('../libs/sendmail');
const dashboard = require('./dashboard');

router.use('/dashboard', dashboard);

router.post('/login', (req, res) => {
    User.find(req.body.email, (err, user) => {
        if (err)  {
            res.sendStatus(401);
        } else {    // user exists
            user.attemptLogin(req.body.password, (err, matches) => {
                if (err) {
                    res.sendStatus(401);
                } else if (matches) {
                    req.session.regenerate((err) => {
                        req.session.user = user;    // this duplicates the users entire account data on the session :(
                        res.sendStatus(200);
                    })
                }
            });
        }
    })
});

router.post('/signup', (req, res) => {
    dbAccess.findUser({emailAddress: req.body.email}, (user) => {    // check for pre-existing user

        if (user !== null) {
            if (user.isVerified === true) {
                res.send('User already exists.');                   // user exists and is verified
            } else {
                res.send('Verification email re-sent.');
                sendUserVerificationEmail(req.body.email);   // user exists but is not verified (send a new verification email)
            }
        } else {
            res.send('Verification email sent.');
            sendUserVerificationEmail(req.body.email);       // user does not exist

            createPasswordHash(req.body.password, (salt, hash) => { // create an unverified user
                User.create(req.body.email, salt, hash, () => {  // TODO include createPassWordHash in User class
                    console.log('User ' + req.body.email + ' created');
                });
            })
        }
    });
});

router.post('/logout', (req, res) => {
    if (req.session.user !== undefined) {
        req.session.destroy((err) => {
            if (err) throw err;
            res.sendStatus(200);
        });
    } else {
        res.sendStatus(401);
    }
});

router.post('/session', (req, res) => {
    if (req.session.user !== undefined && req.session.user !== null) {
        res.send({
            email: req.session.user.emailAddress,
            alerts: req.session.user.alerts,
            updates: req.session.user.updates,
            settings: req.session.user.settings
        });
    } else {
        res.sendStatus(401);
    }
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

/**
 * Create a salted password hash to store in the users record.
 *
 */
createPasswordHash = function (password, callback) {
    const salt = crypto.randomBytes(64);
    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, hash) => {
        callback(salt, hash);
    })
};

module.exports = router;