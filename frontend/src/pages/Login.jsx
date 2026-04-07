import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp, signInWithGoogle } from '../services';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    university: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let result;
      if (isSignUp) {
        result = await signUp(
          formData.email,
          formData.password,
          formData.displayName,
          formData.university
        );
      } else {
        result = await signIn(formData.email, formData.password);
      }

      if (result.success) {
        navigate('/events');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    try {
      const result = await signInWithGoogle();
      if (result.success) {
        navigate('/events');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container brutal-border" style={{ maxWidth: '500px', margin: '2rem auto' }}>
        <div className="form-tape"></div>
        
        <h1 style={{ fontSize: '2.5rem', textTransform: 'uppercase', marginBottom: '1rem' }}>
          {isSignUp ? 'Join Mela' : 'Welcome Back'}
        </h1>
        <p style={{ marginBottom: '2rem', color: '#666' }}>
          {isSignUp ? 'Create your account to start discovering events' : 'Sign in to your account'}
        </p>

        {error && (
          <div style={{ 
            padding: '1rem', 
            background: 'var(--mela-pink)', 
            border: '3px solid black',
            marginBottom: '1rem',
            fontWeight: 700
          }}>
            ⚠️ {error}
          </div>
        )}

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
                options={['', 'FAST NUCES', 'LUMS', 'PUCIT', 'UET', 'Punjab University', 'NUST', 'COMSATS', 'Other']}
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

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading}
            style={{ width: '100%', fontSize: '1.2rem', padding: '1rem', marginTop: '1rem' }}
          >
            {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </Button>
        </form>

        <div style={{ margin: '1.5rem 0', textAlign: 'center', fontWeight: 700 }}>
          - OR -
        </div>

        <Button 
          variant="outline" 
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}
        >
          🔥 Continue with Google
        </Button>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontWeight: 700 }}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <span 
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            style={{ 
              color: 'var(--mela-orange)', 
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </span>
        </div>
      </div>
    </div>
  );
}
