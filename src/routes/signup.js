
const express = require('express');
const router = express.Router();

router.route('/')
    .get((req, res) => {
        res.render('signup');
    })
    .post((req, res) => {
        console.log(req.headers);
        res.render('signup-success');
    });

module.exports = router;
