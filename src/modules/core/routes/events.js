const express = require('express');
const router = express.Router();

// GET /api/core/events
router.get('/', (req, res) => {
  res.json({ success: true, data: [] });
});
// GET /api/core/events/:id
router.get('/:id', (req, res) => {
  res.json({ success: true, data: { id: req.params.id } });
});
// POST /api/core/events
router.post('/', (req, res) => {
  res.json({ success: true, message: 'Evento criado' });
});
// PUT /api/core/events/:id
router.put('/:id', (req, res) => {
  res.json({ success: true, message: 'Evento atualizado' });
});
// DELETE /api/core/events/:id
router.delete('/:id', (req, res) => {
  res.json({ success: true, message: 'Evento removido' });
});

module.exports = router;
