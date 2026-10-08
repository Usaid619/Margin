import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStudio } from '../contexts/StudioContext';
import { AuthLayout } from '../components/auth/AuthLayout';
import { TextField } from '../components/ui/TextField';
import { MagneticButton } from '../components/ui/MagneticButton';
import { QuietError } from '../components/ui/QuietError';

export function Signup() {
  const { signUp } = useStudio();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await signUp(name, email, password);
      navigate('/onboarding', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went quiet. Please try again.');
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Make yourself a room."
      subtitle="It only takes a moment."
      quote="Every writer begins as someone who noticed something, and wrote it down."
      footer={
      <p>
          Already have a room?{' '}
          <Link to="/login" className="link-line text-ink">
            Come back in
          </Link>
          .
        </p>
      }>
      
      <form onSubmit={submit} noValidate className="space-y-8">
        <TextField label="What should we call you?" autoComplete="given-name" value={name} onChange={(e) => setName(e.target.value)} required />
        <TextField label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <TextField
          label="Password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          hint="At least eight characters."
          required />
        
        {error && <QuietError message={error} />}
        <div className="pt-2">
          <MagneticButton type="submit" disabled={loading}>
            {loading ? 'Making some room…' : 'Create my studio'}
          </MagneticButton>
        </div>
        <p className="text-xs leading-relaxed text-ink/60">Your writing is private by default. We never read it, sell it, or train anything on it.</p>
      </form>
    </AuthLayout>);

}