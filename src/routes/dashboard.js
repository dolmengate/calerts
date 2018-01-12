const router = require('express').Router();
const User = require('../User');

router.post('/updates/save', async (req, res) => {
    try {
        if (req.session.user !== null) {
            const user = await User.find(req.session.user.emailAddress);
            await user.setUpdates(req.body);
            req.session.user = user;
            res.sendStatus(200);
        } else {
            res.sendStatus(401);
        }
    } catch (err) {
        res.sendStatus(500);
    }
});

router.post('/alerts/save', async (req, res) => {
    try {
        if (req.session.user !== null) {
            const user = await User.find(req.session.user.emailAddress);
            await User.checkAlertsValidity(req.body);
            await user.setAlerts(req.body);
            req.session.alerts = user.alerts;
            res.sendStatus(200);
            return 'done';
        } else {
            res.sendStatus(400);
        }
    } catch (err) {
        console.log(err.message);
        res.sendStatus(400);
    }
});

module.exports = router;
