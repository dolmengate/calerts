
const router = require('express').Router();
const path = require('path');

router.get('/', (req, res) => {
    // if (req.session.user === undefined) {
    //     req.session.regenerate((err) => {
    //         if (err) throw err;
    //     })
    // }
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'));
});

module.exports = router;
