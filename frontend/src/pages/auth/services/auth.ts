import { type SignupData } from '../components/SignupForm';

export async function signup(data: SignupData) {
  const res = await fetch('http://localhost:3000/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Erreur à l'inscription");
  }

  return res.json();
}
