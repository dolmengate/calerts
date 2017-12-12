
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

router.route('/')
    .get((req, res) => {
        res.render('signup');
    })
    .post((req, res) => {
        fs.writeFile(path.join(__dirname, '..', 'emails', 'users.txt'), req.body.email + '\n', {flag: 'a'}, () => {
           console.log('added ' + req.body.email + ' to users');
        });
        res.render('signup-success');
    });

module.exports = router;
