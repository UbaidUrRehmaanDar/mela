import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getFilteredEvents, searchEvents } from '../services';
import { formatEventDate } from '../utils/constants';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

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

export default function EventFeed() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    university: '',
    category: '',
    upcomingOnly: true
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const result = await getFilteredEvents(filters);
    if (result.success) {
      setEvents(result.events);
    }
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      setLoading(true);
      const result = await searchEvents(searchTerm);
      if (result.success) {
        setEvents(result.events);
      }
      setLoading(false);
    } else {
      fetchEvents();
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="container">
      <div className="flex-between" style={{ marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, textTransform: 'uppercase', background: 'var(--mela-orange)', color: '#fff', padding: '0 1rem', border: '3px solid black', transform: 'rotate(-1deg)' }}>
          Event Feed
        </h1>
        <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '400px' }}>
          <Input 
            type="text" 
            placeholder="Search events..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            style={{ marginBottom: 0, flexGrow: 1 }} 
          />
          <Button variant="primary" onClick={() => setShowFilters(!showFilters)}>
            {showFilters ? 'Hide' : 'Filter'}
          </Button>
        </div>
      </div>

      {showFilters && (
        <div style={{ 
          padding: '1.5rem', 
          background: 'var(--mela-yellow)', 
          border: '3px solid black',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>University</label>
              <select 
                className="brutal-border"
                value={filters.university}
                onChange={(e) => handleFilterChange('university', e.target.value)}
                style={{ width: '100%', padding: '0.75rem', fontWeight: 700 }}
              >
                <option value="">All Universities</option>
                <option value="FAST NUCES">FAST NUCES</option>
                <option value="LUMS">LUMS</option>
                <option value="PUCIT">PUCIT</option>
                <option value="UET">UET</option>
                <option value="Punjab University">Punjab University</option>
                <option value="NUST">NUST</option>
                <option value="COMSATS">COMSATS</option>
              </select>
            </div>

            <div className="input-group" style={{ marginBottom: 0 }}>
              <label>Category</label>
              <select 
                className="brutal-border"
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                style={{ width: '100%', padding: '0.75rem', fontWeight: 700 }}
              >
                <option value="">All Categories</option>
                <option value="Tech">Tech</option>
                <option value="Workshop">Workshop</option>
                <option value="Seminar">Seminar</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Meetup">Meetup</option>
                <option value="Conference">Conference</option>
                <option value="Competition">Competition</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'end' }}>
              <label style={{ display: 'flex', alignItems: 'center', fontWeight: 700, cursor: 'pointer' }}>
                <input 
                  type="checkbox"
                  checked={filters.upcomingOnly}
                  onChange={(e) => handleFilterChange('upcomingOnly', e.target.checked)}
                  style={{ marginRight: '0.5rem', width: '20px', height: '20px' }}
                />
                Upcoming Only
              </label>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h2>Loading events...</h2>
        </div>
      ) : events.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem', 
          background: 'var(--mela-white)',
          border: '3px solid black'
        }}>
          <h2>No events found</h2>
          <p style={{ color: '#666', marginTop: '1rem' }}>
            {searchTerm ? 'Try a different search term' : 'No events match your filters'}
          </p>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '1rem', fontWeight: 700, fontSize: '1.1rem' }}>
            Found {events.length} event{events.length !== 1 ? 's' : ''}
          </div>
          <div className="grid-3">
            {events.map(event => (
              <Card key={event.id}>
                <div>
                  <Badge color={CATEGORY_COLORS[event.category] || 'var(--mela-white)'}>
                    {event.category}
                  </Badge>
                </div>
                <h2>{event.title}</h2>
                <span className="uni">{event.university}</span>
                <p className="date">{formatEventDate(event.dateTime)}</p>
                <Link to={`/events/${event.id}`}>
                  <Button variant="outline" style={{ width: '100%' }}>View Details & Save</Button>
                </Link>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
