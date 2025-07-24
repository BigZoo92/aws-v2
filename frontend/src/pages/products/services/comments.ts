export async function fetchComments(productId: number) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/comments/${productId}`);
  if (!res.ok) throw new Error('Erreur lors de la récupération des commentaires');
  return await res.json();
}

export async function postComment(productId: number, user_id: number, content: string) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/comments/${productId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id, content }),
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Erreur lors de la publication du commentaire');
  return await res.json();
}
