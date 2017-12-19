
const router = require('express').Router();

// main route
router.get('/', (req, res) => {
    res.render('dashboard');
});

module.exports = router;
