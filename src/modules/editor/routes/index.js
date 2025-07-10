const express = require('express');
const router = express.Router();

router.use('/', require('./editor'));

module.exports = router;
