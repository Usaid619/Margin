import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStudio } from '../contexts/StudioContext';
import { AuthLayout } from '../components/auth/AuthLayout';
import { TextField } from '../components/ui/TextField';
import { MagneticButton } from '../components/ui/MagneticButton';
import { QuietError } from '../components/ui/QuietError';

export function ResetPassword() {
  const { resetPassword } = useStudio();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Those two passwords don't quite match.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(password);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went quiet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={done ? "You're back in." : 'Choose a new password.'}
      subtitle={done ? 'Everything is exactly where you left it.' : 'Something you will remember, and nobody will guess.'}
      quote="A new key for the same old room.">
      
      {done ?
      <MagneticButton to="/login">Sign in</MagneticButton> :

      <form onSubmit={submit} noValidate className="space-y-8">
          <TextField label="New password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} hint="At least eight characters." required />
          <TextField label="Once more" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          {error && <QuietError message={error} />}
          <div className="flex flex-wrap items-center justify-between gap-6">
            <MagneticButton type="submit" disabled={loading}>
              {loading ? 'Changing the lock…' : 'Save password'}
            </MagneticButton>
            <Link to="/login" className="link-line text-[0.68rem] font-medium uppercase tracking-label">
              Cancel
            </Link>
          </div>
        </form>
      }
    </AuthLayout>);

}