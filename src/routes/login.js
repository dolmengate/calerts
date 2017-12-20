
const router = require('express').Router();
const dbAccess = require('../dbaccess');

router.get('/', (req, res) => {
    res.render('login');
});

router.post('/', (req, res) => {
    dbAccess.findUser({emailAddress: req.body.email, password: req.body.password, isVerified: true}, (user) => {
        if (user !== null) {
            req.session.regenerate((err) => {
                req.session.user = user;
                res.redirect('dashboard');
            });
        } else { res.send('Bad login credentials'); }
    })
});

module.exports = router;
