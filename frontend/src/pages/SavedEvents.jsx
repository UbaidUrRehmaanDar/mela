import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getSavedEvents, unsaveEvent, getCurrentUser } from '../services';
import { formatEventDate } from '../utils/constants';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const CATEGORY_COLORS = {
  'Tech': 'var(--mela-yellow)',
  'Workshop': 'var(--mela-pink)',
  'Seminar': 'var(--mela-teal)',
  'Hackathon': 'var(--mela-orange)',
  'Meetup': 'var(--mela-purple)',
  'Conference': 'var(--mela-blue)',
  'Competition': 'var(--mela-green)',
  'Other': 'var(--mela-white)'
};

export default function SavedEvents() {
  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    fetchSavedEvents();
  }, []);

  const fetchSavedEvents = async () => {
    setLoading(true);
    const result = await getSavedEvents();
    if (result.success) {
      setSavedEvents(result.savedEvents);
    } else {
      setMessage(`Error: ${result.error}`);
    }
    setLoading(false);
  };

  const handleUnsave = async (eventId) => {
    const result = await unsaveEvent(eventId);
    if (result.success) {
      setMessage('Event removed from saved ✓');
      fetchSavedEvents();
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(`Error: ${result.error}`);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Loading saved events...</h2>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 style={{ 
        fontSize: '3rem', 
        fontWeight: 900, 
        textTransform: 'uppercase', 
        background: 'var(--mela-pink)', 
        color: '#fff', 
        padding: '0 1rem', 
        border: '3px solid black', 
        transform: 'rotate(-1deg)',
        display: 'inline-block',
        marginBottom: '2rem'
      }}>
        💾 Saved Events
      </h1>

      {message && (
        <div style={{ 
          padding: '1rem', 
          background: message.includes('Error') ? 'var(--mela-pink)' : 'var(--mela-teal)', 
          border: '3px solid black',
          marginBottom: '1rem',
          fontWeight: 700
        }}>
          {message}
        </div>
      )}

      {savedEvents.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem', 
          background: 'var(--mela-white)',
          border: '3px solid black'
        }}>
          <h2 style={{ marginBottom: '1rem' }}>No saved events yet</h2>
          <p style={{ marginBottom: '2rem', color: '#666' }}>
            Browse events and save the ones you're interested in!
          </p>
          <Button variant="primary" onClick={() => navigate('/events')}>
            Browse Events
          </Button>
        </div>
      ) : (
        <div className="grid-3">
          {savedEvents.map((saved) => (
            <Card key={saved.id}>
              <div style={{ marginBottom: '1rem' }}>
                <Badge color={CATEGORY_COLORS[saved.category] || 'var(--mela-white)'}>
                  {saved.category || 'Event'}
                </Badge>
              </div>
              
              <h2>{saved.eventTitle}</h2>
              
              <p className="date" style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.5rem' }}>
                📅 {formatEventDate(saved.eventDateTime)}
              </p>

              {saved.reminderSent && (
                <div style={{ 
                  marginTop: '0.5rem',
                  fontSize: '0.85rem',
                  color: 'var(--mela-orange)',
                  fontWeight: 700
                }}>
                  ✓ Reminder sent
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <Link to={`/events/${saved.eventId}`} style={{ flex: 1 }}>
                  <Button variant="primary" style={{ width: '100%' }}>
                    View Details
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={() => handleUnsave(saved.eventId)}
                  style={{ padding: '0.75rem 1rem' }}
                >
                  ❌
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {savedEvents.length > 0 && (
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Button variant="outline" onClick={() => navigate('/events')}>
            Browse More Events
          </Button>
        </div>
      )}
    </div>
  );
}
