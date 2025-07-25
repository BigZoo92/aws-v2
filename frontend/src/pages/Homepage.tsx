import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import SigninForm from './auth/components/SigninForm';
import SignupForm, { type SignupData } from './auth/components/SignupForm';
import { signup } from './auth/services/auth';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { fetchStats } from '@/lib/getStats';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/providers/UserProvider';

export default function Homepage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [totalProducts, setTotalProducts] = useState<number | null>(null);

  const handleSignup = async (data: SignupData) => {
    const result = await signup(data);
    if (result.success) {
      toast('Compte créé avec succès');
      setMode('login');
    } else {
      toast('argh', {
        description: result.message,
      });
    }
  };

  useEffect(() => {
    const getStats = async () => {
      const res = await fetchStats();

      if (res.success) {
        setTotalUsers(res.totalUsers);
        setTotalProducts(res.totalProducts);
      } else {
        toast.error(res.message || 'Erreur lors de la récupération des stats');
      }
    };

    getStats();
  }, []);

  useEffect(() => {
    if (user && user !== 'loading') {
      navigate('/dashboard');
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex flex-col gap-8 items-center justify-center p-4">
      <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-8 w-full max-w-md transition-all">
        <div className="flex justify-center gap-4 mb-6">
          <Button
            variant={mode === 'login' ? 'default' : 'ghost'}
            onClick={() => setMode('login')}
            className={cn('w-1/2', mode === 'login' && 'font-bold')}
          >
            Connexion
          </Button>
          <Button
            variant={mode === 'signup' ? 'default' : 'ghost'}
            onClick={() => setMode('signup')}
            className={cn('w-1/2', mode === 'signup' && 'font-bold')}
          >
            Inscription
          </Button>
        </div>

        <div className="animate-in fade-in zoom-in-50 duration-300">
          {mode === 'login' ? (
            <SigninForm onSuccess={() => navigate('/dashboard')} />
          ) : (
            <SignupForm onSubmit={handleSignup} />
          )}
        </div>
      </div>
      <Card>
        <CardContent>
          <CardTitle>Nombre d'utilisateurs inscrits</CardTitle>
          {totalUsers}
        </CardContent>

        <CardContent>
          <CardTitle>Nombre de produits sur notre site</CardTitle>
          {totalProducts}
        </CardContent>
      </Card>
    </div>
  );
}
