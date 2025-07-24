import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Product } from '../../db-schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3000/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Produit non trouvé');
        return res.json();
      })
      .then(setProduct)
      .catch(() => setError('Produit non trouvé'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-xl mx-auto mt-10 space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-6 w-1/3" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-10">{error}</div>;
  }

  if (!product) return null;

  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <Link to="/products">
        <Button variant="outline">← Retour à la liste</Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Détail du produit</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="font-semibold">Titre : </span>
            {product.title}
          </div>
          <Separator />
          <div>
            <span className="font-semibold">Description : </span>
            {product.description || <span className="text-muted-foreground italic">Aucune</span>}
          </div>
          <Separator />
          <div>
            <span className="font-semibold">Prix : </span>
            {product.price} €
          </div>
          <Separator />
          <div>
            <span className="font-semibold">Créé le : </span>
            {new Date(product.created_at).toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
