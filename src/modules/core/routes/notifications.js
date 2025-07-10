const express = require('express');
const router = express.Router();

// GET /api/core/notifications
router.get('/', (req, res) => {
  res.json({ success: true, data: [] });
});
// GET /api/core/notifications/unread
router.get('/unread', (req, res) => {
  res.json({ success: true, data: [] });
});
// POST /api/core/notifications
router.post('/', (req, res) => {
  res.json({ success: true, message: 'Notificação criada' });
});
// PUT /api/core/notifications/:id/read
router.put('/:id/read', (req, res) => {
  res.json({ success: true, message: 'Notificação marcada como lida' });
});
// DELETE /api/core/notifications/:id
router.delete('/:id', (req, res) => {
  res.json({ success: true, message: 'Notificação removida' });
});

module.exports = router;
