const express = require('express');
const router = express.Router();

// GET /api/products
router.get('/', (req, res) => {
  res.json({ success: true, data: [] });
});
// GET /api/products/:id
router.get('/:id', (req, res) => {
  res.json({ success: true, data: { id: req.params.id } });
});
// POST /api/products
router.post('/', (req, res) => {
  res.json({ success: true, message: 'Produto criado' });
});
// PUT /api/products/:id
router.put('/:id', (req, res) => {
  res.json({ success: true, message: 'Produto atualizado' });
});
// DELETE /api/products/:id
router.delete('/:id', (req, res) => {
  res.json({ success: true, message: 'Produto removido' });
});

module.exports = router;
