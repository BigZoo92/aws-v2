import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db.js';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/test-db', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM app_schema.users');
    res.json(result);
  } catch (err) {
    console.error('Erreur lors de la connexion à la BDD :', err);
    res.status(500).json({ error: 'Erreur connexion BDD' });
  }
});

app.get('/', (_, res) => res.send('API OK ✅'));

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running');
});
