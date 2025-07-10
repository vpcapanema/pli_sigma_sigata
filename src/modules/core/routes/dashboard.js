const express = require('express');
const router = express.Router();

// GET /api/core/dashboard
router.get('/', (req, res) => {
  res.json({ success: true, message: 'Dashboard principal' });
});
// GET /api/core/dashboard/stats
router.get('/stats', (req, res) => {
  res.json({ success: true, data: { users: 10, products: 5 } });
});
// GET /api/core/dashboard/recent
router.get('/recent', (req, res) => {
  res.json({ success: true, data: ['Atividade 1', 'Atividade 2'] });
});

module.exports = router;
