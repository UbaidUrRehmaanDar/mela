import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEventById, saveEvent, isEventSaved, unsaveEvent, getCurrentUser } from '../services';
import { formatEventDate } from '../utils/constants';
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

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [message, setMessage] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchEvent = useCallback(async () => {
    setLoading(true);
    const result = await getEventById(id);
    if (result.success) {
      setEvent(result.event);
    } else {
      setMessage('Event not found');
    }
    setLoading(false);
  }, [id]);

  const checkIfSaved = useCallback(async () => {
    const user = getCurrentUser();
    if (user) {
      const result = await isEventSaved(id);
      if (result.success) {
        setIsSaved(result.isSaved);
      }
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
    checkIfSaved();
  }, [fetchEvent, checkIfSaved]);

  const handleSaveToggle = async () => {
    const user = getCurrentUser();
    if (!user) {
      setMessage('Please login to save events');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    setActionLoading(true);
    
    if (isSaved) {
      const result = await unsaveEvent(id);
      if (result.success) {
        setIsSaved(false);
        setMessage('Event removed from saved ✓');
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } else {
      const result = await saveEvent(id, event.title, event.dateTime);
      if (result.success) {
        setIsSaved(true);
        setMessage('Event saved successfully! ✓');
      } else {
        setMessage(`Error: ${result.error}`);
      }
    }
    
    setActionLoading(false);
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Loading event...</h2>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Event not found</h2>
        <Button variant="primary" onClick={() => navigate('/events')} style={{ marginTop: '2rem' }}>
          Back to Events
        </Button>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
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

      <div className="brutal-border" style={{ background: 'var(--mela-white)', borderRadius: '8px', overflow: 'hidden' }}>
        {/* Event Poster */}
        {event.posterURL ? (
          <img 
            src={event.posterURL} 
            alt={event.title}
            style={{ 
              width: '100%', 
              height: '400px', 
              objectFit: 'cover', 
              borderBottom: '3px solid black' 
            }}
          />
        ) : (
          <div style={{ 
            width: '100%', 
            height: '300px', 
            background: CATEGORY_COLORS[event.category] || 'var(--mela-yellow)', 
            borderBottom: '3px solid black', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <h2 style={{ fontSize: '2rem', textTransform: 'uppercase', opacity: 0.5 }}>
              {event.title}
            </h2>
          </div>
        )}
        
        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <Badge color={CATEGORY_COLORS[event.category] || 'var(--mela-white)'}>{event.category}</Badge>
            <Badge color="var(--mela-white)">{event.university}</Badge>
          </div>
          
          <h1 style={{ fontSize: '3rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem', lineHeight: 1.1 }}>
            {event.title}
          </h1>
          
          <p style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '2rem' }}>
            📅 {formatEventDate(event.dateTime)}
            {event.venue && ` • 📍 ${event.venue}`}
          </p>
          
          <p style={{ fontSize: '1.1rem', marginBottom: '1rem', whiteSpace: 'pre-line' }}>
            {event.description}
          </p>

          <div style={{ 
            padding: '1rem', 
            background: '#f5f5f5', 
            border: '2px solid black',
            marginBottom: '2rem',
            fontSize: '0.95rem'
          }}>
            <strong>Organized by:</strong> {event.organizerEmail}
          </div>

          <div style={{ display: 'flex', gap: '1rem', borderTop: '3px solid black', paddingTop: '2rem', flexWrap: 'wrap' }}>
            <Button 
              variant={isSaved ? "success" : "primary"}
              onClick={handleSaveToggle}
              disabled={actionLoading}
              style={{ flexGrow: 1 }}
            >
              {actionLoading ? 'Loading...' : (isSaved ? '✓ Saved' : '📌 Save Event')}
            </Button>
            <Button variant="outline" onClick={() => navigate('/events')}>
              ← Back to Events
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

