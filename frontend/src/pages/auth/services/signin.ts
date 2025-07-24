import type { SigninData } from '../components/SigninForm';

export async function signin(data: SigninData) {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });

    if (!res.ok) {
      const { error } = await res.json();
      return { success: false, message: error || 'Erreur inconnue' };
    }

    const { token } = await res.json();
    localStorage.setItem('token', token);

    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, message: 'Impossible de se connecter' };
  }
}
