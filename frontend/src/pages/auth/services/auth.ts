import { type SignupData } from '../components/SignupForm';

export async function signup(data: SignupData) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    credentials: 'include',
  });

  if (!res.ok) {
    throw new Error("Erreur à l'inscription");
  }

  return res.json();
}
