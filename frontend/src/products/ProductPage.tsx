import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import React, { useState, useEffect } from "react";
import { fetchComments, postComment } from "../pages/products/services/comments";

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  created_at?: string;
};

import { useParams } from 'react-router-dom';

export default function ProductPage() {
  const { id } = useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  //TODO: À remplacer par l'user_id réel quand auth front dispo
  const user_id = 1;

  useEffect(() => {
    setLoading(true);
    if (!id) return;
    fetch(`http://localhost:3000/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Produit non trouvé');
        return res.json();
      })
      .then(setProduct)
      .catch(() => setError('Produit non trouvé'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!product) return;
    setLoading(true);
    fetchComments(product.id)
      .then(setComments)
      .catch(() => setError("Erreur lors du chargement des commentaires"))
      .finally(() => setLoading(false));
  }, [product]);

  const sortedComments = [...comments].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !product) return;
    setLoading(true);
    postComment(product.id, user_id, comment)
      .then(newComment => {
        setComments([newComment, ...comments]);
        setComment("");
      })
      .catch(() => setError("Erreur lors de la publication du commentaire"))
      .finally(() => setLoading(false));
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: 40 }}>Chargement...</div>;
  }
  if (error || !product) {
    return <div style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error || 'Produit non trouvé'}</div>;
  }
  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px #eee', background: '#fff' }}>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ width: 180, height: 180, background: '#f5f5f5', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#bbb' }}>Image du produit</span>
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{product.name}</h1>
          <p style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{product.price} €</p>
          <p style={{ marginBottom: 16, color: '#444' }}>{product.description}</p>
          <Button>Ajouter au panier</Button>
        </div>
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginTop: 32, marginBottom: 16 }}>
        <Input
          placeholder="écrire un commentaire"
          value={comment}
          onChange={e => setComment(e.target.value)}
          style={{ flex: 1 }}
          disabled={loading}
        />
        <Button type="submit" disabled={loading || !comment.trim()}>Publier</Button>
      </form>
      {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
      <div>
        {loading && <div style={{ color: '#888', fontSize: 14 }}>Chargement...</div>}
        {!loading && sortedComments.length === 0 && <div style={{ color: '#888', fontSize: 14 }}>Aucun commentaire pour ce produit.</div>}
        {sortedComments.map(c => (
          <div key={c.id} style={{ borderBottom: '1px solid #eee', padding: '8px 0' }}>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{c.user || `Vous`}</div>
            <div style={{ fontSize: 15 }}>{c.content}</div>
            <div style={{ color: '#aaa', fontSize: 12 }}>{new Date(c.created_at).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
