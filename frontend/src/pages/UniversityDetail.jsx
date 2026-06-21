import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapPin, Globe, ArrowLeft, Calendar, ShieldCheck, HelpCircle } from 'lucide-react';
import { getUniversityProfileByName, ICON_MAP } from '../utils/universitiesData';
import { getFilteredEvents } from '../services/eventService';
import Button from '../components/ui/Button';
import EventCard from '../components/ui/EventCard';
import { SkeletonGrid } from '../components/ui/Skeleton';

export default function UniversityDetail() {
  const { name } = useParams();
  const decodedName = decodeURIComponent(name);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uniProfile = getUniversityProfileByName(decodedName);
    setProfile(uniProfile);
    fetchUniversityEvents(uniProfile.name);
  }, [decodedName]);

  const fetchUniversityEvents = async (uniName) => {
    setLoading(true);
    const result = await getFilteredEvents({ university: uniName, upcomingOnly: true });
    if (result.success) {
      setEvents(result.events);
    }
    setLoading(false);
  };

  if (!profile) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>University Profile Not Found</h2>
        <Button variant="primary" onClick={() => navigate('/universities')} style={{ marginTop: '2rem' }}>
          Back to Universities
        </Button>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in">
      {/* Back Button */}
      <Button 
        variant="outline" 
        onClick={() => navigate('/universities')} 
        style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '2rem', fontWeight: 700 }}
      >
        <ArrowLeft size={16} /> Back to Universities
      </Button>

      {/* Main Info Card */}
      <div className="brutal-border" style={{
        background: 'var(--yellow)',
        padding: '2.5rem',
        borderRadius: 0,
        marginBottom: '3rem',
        position: 'relative'
      }}>
        {/* University Icon Avatar */}
        {(() => {
          const IconComponent = ICON_MAP[profile.icon] || ICON_MAP['School'];
          return (
            <div style={{
              width: '80px', height: '80px',
              borderRadius: '50%',
              background: 'var(--white)',
              border: 'var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <IconComponent size={36} strokeWidth={2.5} />
            </div>
          );
        })()}

        <h1 style={{
          fontSize: '3.5rem',
          fontWeight: 900,
          textTransform: 'uppercase',
          lineHeight: '1.1',
          marginBottom: '0.5rem'
        }}>
          {profile.name}
        </h1>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--black)' }}>
            <MapPin size={18} /> {profile.location}
          </span>
          {profile.website && (
            <a 
              href={profile.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'black', textDecoration: 'underline' }}
            >
              <Globe size={18} /> Official Website
            </a>
          )}
        </div>

        <p style={{
          fontSize: '1.2rem',
          lineHeight: '1.5',
          background: 'var(--white)',
          padding: '1.5rem',
          border: 'var(--border)',
          borderRadius: 0,
          fontWeight: 500,
          marginBottom: '2rem'
        }}>
          {profile.description}
        </p>

        {/* Societies section */}
        <div>
          <h3 style={{ textTransform: 'uppercase', fontWeight: 900, fontSize: '1.2rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ShieldCheck size={20} /> Registered Societies & Clubs
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {profile.registeredOrganizers.map((org, index) => (
              <span 
                key={index}
                style={{
                  background: 'var(--white)',
                  border: 'var(--border-thin)',
                  padding: '0.4rem 0.8rem',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  borderRadius: 0,
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                {org}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Events Section */}
      <h2 style={{
        fontSize: '2.5rem',
        fontWeight: 900,
        textTransform: 'uppercase',
        marginBottom: '2rem',
        borderBottom: 'var(--border-thick)',
        paddingBottom: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem'
      }}>
        <Calendar size={28} /> Upcoming Campus Events
      </h2>

      {loading ? (
        <SkeletonGrid count={3} />
      ) : events.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'var(--white)',
          border: 'var(--border)',
          borderRadius: 0,
          boxShadow: 'var(--shadow)'
        }}>
          <h3 style={{ textTransform: 'uppercase', fontWeight: 900 }}>No upcoming events scheduled</h3>
          <p style={{ color: 'var(--gray-600)', marginTop: '0.5rem', fontWeight: 700 }}>
            No registered societies have posted events yet.
          </p>
          <Link to="/submit" style={{ textDecoration: 'none' }}>
            <Button variant="primary" style={{ marginTop: '1.5rem', fontWeight: 900 }}>
              Submit an Event
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
