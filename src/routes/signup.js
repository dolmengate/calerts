
const router = require('express').Router();
const databaseAccess = require('../dbaccess');
const User = require('../User');

router.get('/confirm/:verificationHash', (req, res) => {

    // set user to verified and deactivate the verification email
    databaseAccess.findEmail({'verify.uvHash' : req.params.verificationHash, 'verify.isActive': true}, (email) => {
        if (email !== null) {       // email with uvHash was found
            const user = new User(email.recipientAddress);
            user.init(() => {
                user.setVerified(true, () => {
                    databaseAccess.updateEmail({recipientAddress: email.recipientAddress, 'verify.isActive': true}, {$set: {'verify.isActive': false} }, (op) => {
                        res.render('login', {
                            message: 'User ' + email.recipientAddress + ' verified!'
                        });
                    })
                });
            });
        } else {
            res.send('That user verification email has expired.')
        }
    })
});

module.exports = router;
