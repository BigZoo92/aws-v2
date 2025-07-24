import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Product } from '../../db-schema';

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

  if (loading) return <div>Chargement...</div>;
  if (error) return <div style={{color:'red'}}>{error}</div>;
  if (!product) return null;

  return (
    <div style={{ padding: 24 }}>
      <Link to="/products">Retour à la liste</Link>
      <h2>Détail du produit</h2>
      <div><b>Titre:</b> {product.title}</div>
      <div><b>Description:</b> {product.description}</div>
      <div><b>Prix:</b> {product.price} €</div>
      <div><b>Créé le:</b> {product.created_at}</div>
    </div>
  );
}
