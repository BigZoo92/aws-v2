import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import type { Product } from '../../db-schema';
import { Link } from 'react-router-dom';
import { useUser } from '@/providers/UserProvider';

export default function ProductCRUD() {
  const { user } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<Partial<Product>>({
    title: '',
    description: '',
    price: null,
    user_id: 1,
    image_url: null,
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
        credentials: 'include',
      });
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, isFile?: boolean) => {
    console.log(e);
    setForm((f) => ({
      ...f,
      [e.target.name]: isFile && e.target?.files ? e.target.files[0] : e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const method = editingId ? 'PUT' : 'POST';
      console.log({ form });
      const url = editingId
        ? `${import.meta.env.VITE_API_URL}/products/${editingId}`
        : `${import.meta.env.VITE_API_URL}/products`;

      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          const newValue = typeof value === 'number' ? String(value) : value;
          formData.append(key, newValue);
        }
      });
      await fetch(url, {
        method,
        body: formData,
        credentials: 'include',
      });
      setForm({ title: '', description: '', price: null, user_id: 1, image_url: null });
      setEditingId(null);
      fetchProducts();
    } catch (e) {
      setError('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (p: Product) => {
    setForm({
      title: p.title,
      description: p.description || '',
      price: p.price,
      user_id: p.user_id,
      image_url: p.image_url,
    });
    setEditingId(p.id);
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (e) {
      setError('Erreur suppression');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user === 'loading') return null;
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Produits</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <Label htmlFor="title">Titre</Label>
          <Input
            id="title"
            name="title"
            value={form.title || ''}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={form.description || ''}
            onChange={(e) => handleChange(e as unknown as React.ChangeEvent<HTMLInputElement>)}
          />
        </div>

        <div>
          <Label htmlFor="price">Prix (€)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={form.price ?? ''}
            onChange={handleChange}
          />
        </div>
        <input type="file" name="image_url" onChange={(e) => handleChange(e, true)} />

        <div className="flex space-x-2">
          <Button type="submit" disabled={loading}>
            {editingId ? 'Modifier' : 'Créer'}
          </Button>
          {editingId && (
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ title: '', description: '', price: null, user_id: 1 });
              }}
            >
              Annuler
            </Button>
          )}
        </div>
      </form>

      <Separator className="mb-6" />

      <div className="space-y-4">
        {products.map((p) => (
          <Card key={p.id}>
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                {p.image_url && (
                  <div
                    style={{
                      maxWidth: 300,
                      maxHeight: 300,
                    }}
                  >
                    <img
                      style={{
                        objectFit: 'contain',
                        width: '100%',
                        borderRadius: '12px',
                      }}
                      src={p.image_url}
                      alt=""
                    />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.description}</p>
                  <p className="font-bold mt-1">{p.price} €</p>
                </div>
                <div className="flex flex-col space-y-2 items-end">
                  {p.user_id === user.id && (
                    <>
                      <Button size="sm" variant="default" onClick={() => handleEdit(p)}>
                        Modifier
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(p.id)}>
                        Supprimer
                      </Button>
                    </>
                  )}
                  <Link to={`/products/${p.id}`}>
                    <Button size="sm" variant="outline">
                      Détail
                    </Button>
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
