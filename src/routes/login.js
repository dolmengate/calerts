
const router = require('express').Router();
const dbAccess = require('../dbaccess');

router.get('/', (req, res) => {
    res.render('login');
});

router.post('/', (req, res) => {
    dbAccess.findUser({emailAddress: req.body.email, password: req.body.password}, (user) => {
        if (user !== null)
            res.render('dashboard', )
    })
});

module.exports = router;
