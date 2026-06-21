import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="container animate-fade-in" style={{ textAlign: 'center', paddingTop: '4rem', paddingBottom: '4rem' }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div style={{
          fontSize: '6rem', fontWeight: 900, lineHeight: 1,
          color: 'var(--pink)', WebkitTextStroke: '3px black',
          marginBottom: '1rem'
        }}>
          404
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '1rem' }}>
          Page Not Found
        </h1>
        <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--gray-600)', marginBottom: '2rem' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="primary" onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Home size={16} /> Go Home
          </Button>
          <Button variant="outline" onClick={() => navigate('/events')} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Search size={16} /> Browse Events
          </Button>
        </div>
      </div>
    </div>
  );
}
