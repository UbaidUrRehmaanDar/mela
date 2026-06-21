import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle, Lock } from 'lucide-react';
import { supabase } from '../config/supabase';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function PasswordReset() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      const params = new URLSearchParams(hash.replace('#', '?'));
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');

      if (accessToken) {
        supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || '',
        }).then(({ error }) => {
          if (error) {
            setError('Invalid or expired reset link. Please request a new one.');
          } else {
            setVerified(true);
          }
        });
      } else {
        setError('Invalid reset link.');
      }
    } else {
      setError('No reset token found. Please request a password reset from the login page.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="container animate-fade-in">
        <div className="form-container">
          <div className="form-tape" aria-hidden="true" />
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <CheckCircle size={48} style={{ color: 'var(--green)', marginBottom: '1rem' }} />
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Password Updated
            </h1>
            <p style={{ fontWeight: 700, marginBottom: '1.5rem' }}>
              Your password has been reset successfully.
            </p>
            <Button variant="primary" onClick={() => navigate('/login')}>
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in">
      <div className="form-container">
        <div className="form-tape" aria-hidden="true" />

        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Lock size={24} /> Reset Password
        </h1>
        <p>Enter your new password below.</p>

        {error && (
          <div className="alert error" role="alert">
            <AlertCircle size={18} aria-hidden="true" />
            {error}
          </div>
        )}

        {verified && (
          <form onSubmit={handleSubmit}>
            <Input
              label="New Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              required
            />
            <p className="input-hint">Minimum 6 characters</p>

            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>
        )}

        {!verified && !error && (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <p style={{ fontWeight: 700 }}>Verifying your reset link...</p>
          </div>
        )}
      </div>
    </div>
  );
}
