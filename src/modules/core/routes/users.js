const express = require('express');
const router = express.Router();

// GET /api/core/users
router.get('/', (req, res) => {
  res.json({ success: true, data: [] });
});
// GET /api/core/users/:id
router.get('/:id', (req, res) => {
  res.json({ success: true, data: { id: req.params.id } });
});
// POST /api/core/users
router.post('/', (req, res) => {
  res.json({ success: true, message: 'Usuário criado' });
});
// PUT /api/core/users/:id
router.put('/:id', (req, res) => {
  res.json({ success: true, message: 'Usuário atualizado' });
});
// DELETE /api/core/users/:id
router.delete('/:id', (req, res) => {
  res.json({ success: true, message: 'Usuário removido' });
});

module.exports = router;
