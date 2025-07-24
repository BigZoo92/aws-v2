import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';
import SigninForm from './auth/components/SigninForm';
import SignupForm, { type SignupData } from './auth/components/SignupForm';
import { signup } from './auth/services/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Homepage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  const handleSignup = async (data: SignupData) => {
    const result = await signup(data);
    if (result.success) {
      toast('Compte créé avec succès');
      setMode('login');
    } else {
      toast('Erreur lors de la création du compte', {
        description: result.message,
      });
    }
  };

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
            <SigninForm onSuccess={() => toast('Bienvenue !')} />
          ) : (
            <SignupForm onSubmit={handleSignup} />
          )}
        </div>
      </div>
      <Card>
        <CardContent>
          <CardTitle>Wesh</CardTitle>
          Nombre d'utilisateurs inscrits : 1
        </CardContent>

        <CardContent>
          <CardTitle>Wesh 2</CardTitle>
          Nombre de produits sur notre site : 1
        </CardContent>
      </Card>
    </div>
  );
}
