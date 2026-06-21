import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { signIn, signUp, resetPassword, resendConfirmation } from '../services';
import { validateUniversityEmail, UNIVERSITY_DOMAINS, SIGNUP_UNIVERSITY_OPTIONS } from '../utils/constants';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    university: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleForgotPassword = async () => {
    if (!formData.email.trim()) {
      setError('Enter your email address first');
      return;
    }
    setLoading(true);
    setError('');
    const result = await resetPassword(formData.email);
    if (result.success) {
      setSuccessMsg(result.message);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setNeedsConfirmation(false);

    if (isSignUp) {
      const { valid, message } = validateUniversityEmail(formData.email, formData.university);
      if (!valid) {
        setError(message);
        setLoading(false);
        return;
      }
    }

    try {
      let result;
      if (isSignUp) {
        result = await signUp(formData.email, formData.password, formData.displayName, formData.university);
      } else {
        result = await signIn(formData.email, formData.password);
      }

      if (result.success) {
        if (result.needsConfirmation) {
          setNeedsConfirmation(true);
          setConfirmEmail(formData.email);
          setSuccessMsg(result.message);
        } else {
          navigate('/events');
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    setLoading(true);
    setError('');
    const result = await resendConfirmation(confirmEmail);
    if (result.success) {
      setSuccessMsg(result.message);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <div className="form-container">
        <div className="form-tape" aria-hidden="true" />

        <h1>{isSignUp ? 'Join MELA' : 'Welcome Back'}</h1>
        <p>
          {isSignUp ? 'Create your account to start discovering events' : 'Sign in to your account'}
        </p>

        {error && (
          <div className="alert error" role="alert">
            <AlertCircle size={18} aria-hidden="true" />
            {error}
          </div>
        )}
        {successMsg && !needsConfirmation && (
          <div className="alert success" role="status">{successMsg}</div>
        )}

        {needsConfirmation ? (
          <div style={{ textAlign: 'center', padding: '32px 0' }}>
            <h2 className="text-subsection" style={{ marginBottom: '16px' }}>Check Your Email</h2>
            <p className="font-body" style={{ marginBottom: '24px', color: 'var(--gray-500)' }}>
              We sent a confirmation link to <strong>{confirmEmail}</strong>. Click the link to activate your account, then sign in.
            </p>
            <Button variant="outline" onClick={handleResendConfirmation} disabled={loading}>
              {loading ? 'Sending...' : 'Resend Confirmation Email'}
            </Button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              {isSignUp && (
                <>
                  <Input
                    label="Full Name"
                    name="displayName"
                    placeholder="John Doe"
                    value={formData.displayName}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="University"
                    name="university"
                    type="select"
                    options={SIGNUP_UNIVERSITY_OPTIONS}
                    value={formData.university}
                    onChange={handleChange}
                    required
                  />
                </>
              )}

              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="you@university.edu.pk"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {isSignUp && formData.university && formData.university !== 'Free / Not in University' && formData.university !== 'Other' && (
                <p className="input-hint">
                  Use your university email: @{UNIVERSITY_DOMAINS[formData.university]?.[0]}
                </p>
              )}

              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {isSignUp && (
                <p className="input-hint">Minimum 6 characters</p>
              )}
              {!isSignUp && (
                <button type="button" className="link-action" onClick={handleForgotPassword} disabled={loading}>
                  Forgot password?
                </button>
              )}

              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                style={{ width: '100%', marginTop: '16px' }}
              >
                {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
              </Button>
            </form>

            <div style={{ marginTop: '24px', textAlign: 'center' }} className="font-ui">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                className="link-action"
                onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
