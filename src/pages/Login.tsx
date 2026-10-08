import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStudio } from '../contexts/StudioContext';
import { AuthLayout } from '../components/auth/AuthLayout';
import { TextField } from '../components/ui/TextField';
import { MagneticButton } from '../components/ui/MagneticButton';
import { QuietError } from '../components/ui/QuietError';

export function Login() {
  const { signIn } = useStudio();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('alex@margin.studio');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      navigate((location.state as {from?: string;} | null)?.from ?? '/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "We couldn't open the door just now. Try again in a moment.");
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back."
      subtitle="Your words have been waiting."
      quote="The lamp is on. The page remembers where you left off."
      footer={
      <p>
          New here?{' '}
          <Link to="/signup" className="link-line text-ink">
            Make yourself a room
          </Link>
          .
        </p>
      }>
      
      <form onSubmit={submit} noValidate className="space-y-8">
        <TextField label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hint="In this preview, any password of six or more characters opens the studio."
          required />
        
        {error && <QuietError message={error} />}
        <div className="flex flex-wrap items-center justify-between gap-6 pt-2">
          <MagneticButton type="submit" disabled={loading}>
            {loading ? 'Opening your notebook…' : 'Enter the studio'}
          </MagneticButton>
          <Link to="/forgot-password" className="link-line text-[0.68rem] font-medium uppercase tracking-label">
            Forgot password
          </Link>
        </div>
      </form>
    </AuthLayout>);

}