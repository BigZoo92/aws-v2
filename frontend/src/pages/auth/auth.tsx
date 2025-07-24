import SigninForm from './components/SigninForm';
import type { SignupData } from './components/SignupForm';
import SignupForm from './components/SignupForm';
import { signup } from './services/auth';

export default function SignupPage() {
  const handleSignup = async (data: SignupData) => {
    try {
      const res = await signup(data);
      console.log('Inscription réussie :', res);
    } catch (err) {
      alert('Erreur : ' + err);
    }
  };

  return (
    <>
      <SignupForm onSubmit={handleSignup} />
      <SigninForm onSuccess={() => console.log('gros zeub')} />
    </>
  );
}
