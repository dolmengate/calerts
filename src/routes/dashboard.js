
const router = require('express').Router();

// main route
router.get('/', (req, res) => {
    if (req.session.user !== undefined) {
        res.render('dashboard', {
            user: req.session.user.emailAddress,
            settings: req.session.user.settings
        });
    } else {
        res.render('dashboard');
    }
});

router.post('/', (req, res) => {
    if (req.session.user !== undefined) {
        // do logged-in-required-thing here
        console.log('you are logged in as ' + req.session.user.emailAddress);
        res.sendStatus(200);
    } else {
        res.redirect('login');
    }
});

module.exports = router;
