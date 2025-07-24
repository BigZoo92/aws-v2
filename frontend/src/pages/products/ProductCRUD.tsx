import React, { useEffect, useState } from 'react';
import type { Product } from '../../db-schema';
import { Link } from 'react-router-dom';

const API = 'http://localhost:3000/products';

export default function ProductCRUD() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Partial<Product>>({ title: '', description: '', price: null, user_id: 1 });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(API);
      setProducts(await res.json());
    } catch (e) {
      setError('Erreur chargement produits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (editingId) {
        await fetch(`${API}/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else {
        await fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      setForm({ title: '', description: '', price: null, user_id: 1 });
      setEditingId(null);
      fetchProducts();
    } catch (e) {
      setError('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p: Product) => {
    setForm({ title: p.title, description: p.description || '', price: p.price, user_id: p.user_id });
    setEditingId(p.id);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await fetch(`${API}/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (e) {
      setError('Erreur suppression');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Produits</h2>
      {error && <div style={{color:'red'}}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Titre" value={form.title || ''} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={form.description || ''} onChange={handleChange} />
        <input name="price" type="number" placeholder="Prix" value={form.price ?? ''} onChange={handleChange} />
        <button type="submit" disabled={loading}>{editingId ? 'Modifier' : 'Créer'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ title: '', description: '', price: null, user_id: 1 }); }}>Annuler</button>}
      </form>
      <ul>
        {products.map(p => (
          <li key={p.id}>
            <b>{p.title}</b> ({p.price} €) <br/>
            <button onClick={() => handleEdit(p)}>Edit</button>
            <button onClick={() => handleDelete(p.id)}>Delete</button>
            <Link to={`/products/${p.id}`}>
              <button>Détail</button>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}