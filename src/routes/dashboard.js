
const express = require('express');
const router = express.Router();
const App = require('../app');

// main route
router.get('/', (req, res) => {
    res.render('dashboard',
        {
            mayerIndex : App.getMayerIndex(),
            twoHundredDayMovingAverage : App.getTwoHundredDMA(),
            lastUpdated: App.getLastUpdated()
        }
    );
});

module.exports = router;
