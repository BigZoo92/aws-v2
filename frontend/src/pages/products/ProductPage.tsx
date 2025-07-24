import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Product } from '../../db-schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { fetchComments, postComment } from './services/comments';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [comment, setComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [errorComments, setErrorComments] = useState<string | null>(null);

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

  // Charge les commentaires à l'affichage
  useEffect(() => {
    if (!id) return;
    setLoadingComments(true);
    fetchComments(Number(id))
      .then(setComments)
      .catch(() => setErrorComments('Erreur lors du chargement des commentaires'))
      .finally(() => setLoadingComments(false));
  }, [id]);

  // Tri des commentaires par date (plus récent en haut)
  const sortedComments = [...comments].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !id) return;
    setLoadingComments(true);
    // TODO : Remplacer 1 par l'id réel de l'utilisateur connecté quand dispo
    postComment(Number(id), 1, comment)
      .then(newComment => {
        setComments([newComment, ...comments]);
        setComment("");
      })
      .catch(() => setErrorComments('Erreur lors de la publication du commentaire'))
      .finally(() => setLoadingComments(false));
  };

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
      <form onSubmit={handleSubmit} className="flex gap-2 mt-8 mb-4">
        <Input
          placeholder="écrire un commentaire"
          value={comment}
          onChange={e => setComment(e.target.value)}
          disabled={loadingComments}
        />
        <Button type="submit" disabled={loadingComments || !comment.trim()}>Publier</Button>
      </form>
      {errorComments && <div className="text-red-500 mb-2">{errorComments}</div>}
      <div>
        {loadingComments && <div className="text-muted-foreground">Chargement des commentaires...</div>}
        {!loadingComments && sortedComments.length === 0 && <div className="text-muted-foreground">Aucun commentaire pour ce produit.</div>}
        {sortedComments.map(c => (
          <div key={c.id} className="border-b border-muted py-2">
            <div className="font-semibold text-sm">{c.user || `Vous`}</div>
            <div className="text-base">{c.content}</div>
            <div className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
