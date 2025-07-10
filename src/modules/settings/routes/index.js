const express = require('express');
const router = express.Router();

router.use('/', require('./settings'));

module.exports = router;
