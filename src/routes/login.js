
const router = require('express').Router();
const dbAccess = require('../dbaccess');
const crypto = require('crypto');

router.get('/', (req, res) => {
    res.render('login');
});

router.post('/', (req, res) => {
    dbAccess.findUser({emailAddress: req.body.email, isVerified: true}, (user) => {
        createPasswordAttemptHash(req.body.password, user.salt.buffer, (attemptHash) => {
            if (Buffer.compare(attemptHash,user.hash.buffer) === 0) {
                req.session.regenerate((err) => {
                    if (err) throw err;
                    req.session.user = user;    // this duplicates the users account data on the session :(
                    res.redirect('dashboard');
                });
            } else { res.send('Bad login credentials'); }
        })
    })
});


/**
 *  Create a hash from the user's password entry value and stored salt.
 *
 */
createPasswordAttemptHash = function (enteredPassword, salt, callback) {
    crypto.pbkdf2(enteredPassword, salt, 100000, 64, 'sha512', (err, attemptHash) => {
        callback(attemptHash);
    })
};

module.exports = router;
