
const express = require('express');
const router = express.Router();
const Calcs = require('../libs/Calcs');

// main route
router.get('/', (req, res) => {
        res.render('dashboard');
    });

    router.post(('/'), (req, res) => {
        console.log(req.headers);
        Calcs.getMayerIndex((mayerIndex) => {
            res.send( { mayerIndex } );
        });
    });

module.exports = router;
