'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { signin } from '../services/signin';
import { toast } from 'sonner';

export interface SigninData {
  email: string;
  password: string;
}

interface SigninFormProps {
  onSuccess?: () => void;
}

export default function SigninForm({ onSuccess }: SigninFormProps) {
  const [formData, setFormData] = useState<SigninData>({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await signin(formData);
    setLoading(false);

    if (result.success) {
      toast('Connexion réussie');
      onSuccess?.();
    } else {
      toast('Erreur de connexion', {
        description: result.message,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="votre@email.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Connexion...' : 'Se connecter'}
      </Button>
    </form>
  );
}
