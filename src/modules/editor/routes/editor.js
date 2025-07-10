const express = require('express');
const router = express.Router();

// GET /api/editor
router.get('/', (req, res) => {
  res.json({ success: true, data: [] });
});
// POST /api/editor
router.post('/', (req, res) => {
  res.json({ success: true, message: 'Editor salvo' });
});
// PUT /api/editor/:id
router.put('/:id', (req, res) => {
  res.json({ success: true, message: 'Editor atualizado' });
});
// DELETE /api/editor/:id
router.delete('/:id', (req, res) => {
  res.json({ success: true, message: 'Editor removido' });
});

module.exports = router;
