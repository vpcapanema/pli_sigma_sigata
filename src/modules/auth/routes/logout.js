const express = require('express');
const router = express.Router();

// POST /api/auth/logout
router.post('/', (req, res) => {
  res.json({ success: true, message: 'Logout realizado' });
});

module.exports = router;
