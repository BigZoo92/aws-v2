import express from 'express';
import pool from '../db.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query(
    'SELECT id, name, email, role, created_at FROM app_schema.users WHERE id = $1',
    [id]
  );
  if (!rows[0]) return res.status(404).json({ error: 'Utilisateur non trouvé' });
  res.json(rows[0]);
});

router.put('/:id/name', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Veuillez choisir un nom' });
  await pool.query('UPDATE app_schema.users SET name = $1 WHERE id = $2', [name, id]);
  res.json({ success: true });
});

router.get('/:id/products', async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query(
    'SELECT * FROM app_schema.products WHERE user_id = $1 ORDER BY created_at DESC',
    [id]
  );
  res.json(rows);
});

export default router;
