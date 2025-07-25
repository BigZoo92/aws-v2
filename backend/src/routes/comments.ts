import express from 'express';
import pool from '../db.js';
import { Request, Response } from 'express';

const router = express.Router();

router.get('/:productId', async (req: Request, res: Response) => {
  const { productId } = req.params;
  try {
    const { rows } = await pool.query(
      'SELECT c.*, u.name as user FROM app_schema.comments c JOIN app_schema.users u ON c.user_id = u.id WHERE c.product_id = $1 ORDER BY c.created_at DESC',
      [productId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des commentaires' });
  }
});

router.post('/by-products', async (req: Request, res: Response) => {
  const { productIds } = req.body;
  if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
    return res.status(400).json({ error: 'Le body doit être { productIds: number[] } non vide.' });
  }
  try {
    const { rows } = await pool.query(
      `SELECT c.*, u.name as user FROM app_schema.comments c
        JOIN app_schema.users u ON c.user_id = u.id
        WHERE c.product_id = ANY($1::int[])
        ORDER BY c.created_at DESC`,
      [productIds]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des commentaires' });
  }
});

router.post('/:productId', async (req: Request, res: Response) => {
  const { productId } = req.params;
  const { user_id, content } = req.body;
  if (!user_id || !content) return res.status(400).json({ error: 'user_id et content requis' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO app_schema.comments (user_id, product_id, content) VALUES ($1, $2, $3) RETURNING *',
      [user_id, productId, content]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la création du commentaire' });
  }
});

export default router;
