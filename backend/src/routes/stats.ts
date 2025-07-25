import express from 'express';
import pool from '../db.js';
import { Request, Response } from 'express';

const router = express.Router();

router.get('/users', async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query('SELECT COUNT(*) AS total FROM app_schema.users');
    res.json({ totalUsers: parseInt(rows[0].total, 10) });
  } catch (err) {
    console.error('Erreur /stats/users:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération du nombre d’utilisateurs' });
  }
});

router.get('/products', async (_req: Request, res: Response) => {
  try {
    const { rows } = await pool.query('SELECT COUNT(*) AS total FROM app_schema.products');
    res.json({ totalProducts: parseInt(rows[0].total, 10) });
  } catch (err) {
    console.error('Erreur /stats/products:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération du nombre de produits' });
  }
});

export default router;
