import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useUser } from '@/providers/UserProvider';
import type { Product } from '@/db-schema';

const user_id = 1;
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/';

export default function Dashboard() {
  const { user, refetch, logout } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [editName, setEditName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user === 'loading') return;
    setEditName(user.name);
    fetch(`${API_URL}/products?user_id=${user_id}`, { credentials: 'include' })
      .then((res) => res.json())
      .then((prods) => {
        setProducts(prods);
        if (prods.length === 0) {
          setComments([]);
          return;
        }
        const productIds = prods.map((p: any) => p.id);
        const body = { productIds };

        fetch(`${API_URL}/comments/by-products`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          credentials: 'include',
        })
          .then((r) => r.json())
          .then((allComments: any) => {
            if (!Array.isArray(allComments)) {
              setComments([]);
              return;
            }
            const flat = allComments.filter((c: any) => c.user_id === user_id);
            setComments(flat);
          });
      });
  }, [user]);

  const handleNameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const res = await fetch(`${API_URL}/users/${user_id}/name`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName }),
      credentials: 'include',
    });
    if (res.ok) {
      setSuccess('Nom modifié avec succès');
      refetch();
    } else {
      setError('Erreur lors de la modification du nom');
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  if (!user || user === 'loading') return;
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <Button onClick={logout} variant="destructive" className="ml-auto block">
            Se déconnecter
          </Button>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleNameChange} className="space-y-2">
            <div>
              <label htmlFor="name">Nom</label>
              <Input id="name" value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <Button type="submit">Modifier le nom</Button>
          </form>
          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-600">{success}</div>}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Mes produits</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-muted-foreground">Aucun produit créé.</div>
          ) : (
            <ul className="space-y-2">
              {products
                .filter((p) => p.user_id === user.id)
                .map((p) => (
                  <li key={p.id} className="border-b pb-2 flex justify-between">
                    <div>
                      <span className="font-semibold">{p.title}</span> — {p.price} €
                    </div>
                    <Link to={`/products/${p.id}`}>
                      <Button size="sm" variant="outline">
                        Voir
                      </Button>
                    </Link>
                  </li>
                ))}
            </ul>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Mes commentaires</CardTitle>
        </CardHeader>
        <CardContent>
          {comments.length === 0 ? (
            <div className="text-muted-foreground">Aucun commentaire laissé.</div>
          ) : (
            <ul className="space-y-2">
              {comments
                .filter((c) => c.user_id === user.id)
                .map((c: any) => (
                  <li key={c.id} className="border-b pb-2">
                    <span className="font-semibold">Sur produit #{c.product_id}</span> — {c.content}
                  </li>
                ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
