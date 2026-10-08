import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStudio } from '../contexts/StudioContext';
import { AuthLayout } from '../components/auth/AuthLayout';
import { TextField } from '../components/ui/TextField';
import { MagneticButton } from '../components/ui/MagneticButton';
import { QuietError } from '../components/ui/QuietError';

export function ForgotPassword() {
  const { requestPasswordReset } = useStudio();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went quiet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={sent ? 'Check your inbox.' : 'It happens.'}
      subtitle={sent ? `A way back in is on its way to ${email}.` : "Tell us your email and we'll send a way back in."}
      quote="Forgetting is part of remembering. We kept everything safe."
      footer={
      <Link to="/login" className="link-line text-ink">
          ← Back to sign in
        </Link>
      }>
      
      {sent ?
      <div className="space-y-6">
          <p className="leading-relaxed text-ink/70">The link stays open for an hour. If nothing arrives, look in the quieter folders.</p>
          <Link to="/reset-password" className="link-line inline-block text-[0.68rem] font-medium uppercase tracking-label">
            Open the reset link (preview) →
          </Link>
        </div> :

      <form onSubmit={submit} noValidate className="space-y-8">
          <TextField label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          {error && <QuietError message={error} />}
          <MagneticButton type="submit" disabled={loading}>
            {loading ? 'Finding your room…' : 'Send the link'}
          </MagneticButton>
        </form>
      }
    </AuthLayout>);

}