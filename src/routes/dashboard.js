const router = require('express').Router();
const User = require('../User');

router.post('/updates/save', (req, res) => {
    if (req.session.user !== null) {
        new User(req.session.user.emailAddress).init((err, user) => {
            if (err) {
                res.sendStatus(401);
            } else {
                user.setUpdates(req.body, (user) => {
                    req.session.user = user;
                    res.sendStatus(200);
                });
            }
        })
    } else {
        res.sendStatus(401);
    }
});

module.exports = router;
