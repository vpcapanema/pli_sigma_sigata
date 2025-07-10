const express = require('express');
const router = express.Router();

// GET /api/settings
router.get('/', (req, res) => {
  res.json({ success: true, data: {} });
});
// PUT /api/settings
router.put('/', (req, res) => {
  res.json({ success: true, message: 'Configurações atualizadas' });
});

module.exports = router;
