
const express = require('express');
const router = express.Router();

// main route
router.route('/')
    .get((req, res) => {
        res.render('dashboard');
    })
    .post((req, res) => {
        console.log(req.headers);
        res.render('dashboard', {
           message: req.body.message
        });
    });

module.exports = router;
