
const router = require('express').Router();

router.post('/', (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        console.log('logout');
        res.render('dashboard');    // logout works but won't render the new page
    });
});

module.exports = router;
