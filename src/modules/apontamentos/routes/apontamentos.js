const express = require('express');
const router = express.Router();

// GET /api/apontamentos
router.get('/', (req, res) => {
  res.json({ success: true, data: [] });
});
// POST /api/apontamentos
router.post('/', (req, res) => {
  res.json({ success: true, message: 'Apontamento criado' });
});
// PUT /api/apontamentos/:id
router.put('/:id', (req, res) => {
  res.json({ success: true, message: 'Apontamento atualizado' });
});
// DELETE /api/apontamentos/:id
router.delete('/:id', (req, res) => {
  res.json({ success: true, message: 'Apontamento removido' });
});

module.exports = router;
