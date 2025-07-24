import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as products from './products';
import authRouter from './routes/auth';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/products', async (_req, res) => {
  try {
    const all = await products.getAllProducts();
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des produits' });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const product = await products.getProductById(Number(req.params.id));
    if (!product) return res.status(404).json({ error: 'Produit non trouvé' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération du produit' });
  }
});

app.post('/products', async (req, res) => {
  try {
    const created = await products.createProduct(req.body);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la création du produit' });
  }
});

app.put('/products/:id', async (req, res) => {
  try {
    const updated = await products.updateProduct(Number(req.params.id), req.body);
    if (!updated) return res.status(404).json({ error: 'Produit non trouvé' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la modification du produit' });
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    const deleted = await products.deleteProduct(Number(req.params.id));
    if (!deleted) return res.status(404).json({ error: 'Produit non trouvé' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Erreur suppression produit' });
  }
});
app.use('/auth', authRouter);

app.get('/', (_, res) => res.send('API OK ✅'));

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running');
});
