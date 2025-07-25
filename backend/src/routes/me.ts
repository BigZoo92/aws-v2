import express from 'express';
import { authenticate, AuthenticatedRequest } from '../middlewares/authenticate.js';
import pool from '../db.js';

const router = express.Router();

router.get('/me', authenticate, async (req: AuthenticatedRequest, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(400).json({ error: 'User ID missing' });

    const result = await pool.query(
      'SELECT id, name, email, role FROM app_schema.users WHERE id = $1',
      [userId]
    );

    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
});

export default router;
