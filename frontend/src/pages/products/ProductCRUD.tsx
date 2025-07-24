import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import type { Product } from '../../db-schema';
import { Link } from 'react-router-dom';

const API = 'http://localhost:3000/products';

export default function ProductCRUD() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Partial<Product>>({ title: '', description: '', price: null, user_id: 1 });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API}/${editingId}` : API;
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
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
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Produits</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <Label htmlFor="title">Titre</Label>
          <Input id="title" name="title" value={form.title || ''} onChange={handleChange} required />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" value={form.description || ''} onChange={handleChange} />
        </div>

        <div>
          <Label htmlFor="price">Prix (€)</Label>
          <Input id="price" name="price" type="number" value={form.price ?? ''} onChange={handleChange} />
        </div>

        <div className="flex space-x-2">
          <Button type="submit" disabled={loading}>
            {editingId ? 'Modifier' : 'Créer'}
          </Button>
          {editingId && (
            <Button variant="outline" type="button" onClick={() => {
              setEditingId(null);
              setForm({ title: '', description: '', price: null, user_id: 1 });
            }}>
              Annuler
            </Button>
          )}
        </div>
      </form>

      <Separator className="mb-6" />

      <div className="space-y-4">
        {products.map(p => (
          <Card key={p.id}>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.description}</p>
                  <p className="font-bold mt-1">{p.price} €</p>
                </div>
                <div className="flex flex-col space-y-2 items-end">
                  <Button size="sm" variant="default" onClick={() => handleEdit(p)}>
                    Modifier
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}>
                    Supprimer
                  </Button>
                  <Link to={`/products/${p.id}`}>
                    <Button size="sm" variant="outline">Détail</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}