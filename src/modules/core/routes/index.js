const express = require('express');
const router = express.Router();

router.use('/dashboard', require('./dashboard'));
router.use('/users', require('./users'));
router.use('/events', require('./events'));
router.use('/notifications', require('./notifications'));

module.exports = router;
