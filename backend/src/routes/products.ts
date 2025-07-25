import express from 'express';
import pool from '../db';
import { upload } from '../middlewares/upload';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM app_schema.products ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM app_schema.products WHERE id = $1', [
      req.params.id,
    ]);
    if (!rows[0]) return res.status(404).json({ error: 'Produit non trouvé' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération du produit' });
  }
});

router.post('/', upload.single('image_url'), async (req, res) => {
  const { user_id, title, description, price } = req.body;
  const file = req.file as Express.MulterS3.File;

  try {
    const imageUrl = file?.location ?? null;

    const { rows } = await pool.query(
      `INSERT INTO app_schema.products (user_id, title, description, price, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, title, description, price, imageUrl]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la création du produit' });
  }
});

router.put('/:id', async (req, res) => {
  const fields = Object.keys(req.body);
  if (fields.length === 0) return res.status(400).json({ error: 'Aucune donnée à mettre à jour' });
  const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
  const values = [req.params.id, ...fields.map((f) => req.body[f])];
  try {
    const { rows } = await pool.query(
      `UPDATE app_schema.products SET ${setClause} WHERE id = $1 RETURNING *`,
      values
    );
    if (!rows[0]) return res.status(404).json({ error: 'Produit non trouvé' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la modification du produit' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await pool.query('DELETE FROM app_schema.products WHERE id = $1', [
      req.params.id,
    ]);
    if (!rowCount) return res.status(404).json({ error: 'Produit non trouvé' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Erreur suppression produit' });
  }
});

export default router;
