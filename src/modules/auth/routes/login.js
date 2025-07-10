const express = require('express');
const router = express.Router();

// POST /api/auth/login
router.post('/', (req, res) => {
  res.json({ success: true, message: 'Login realizado' });
});

module.exports = router;
