const express = require('express');
const router = express.Router();

router.use('/', require('./apontamentos'));

module.exports = router;
