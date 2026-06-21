import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, FileText, CalendarDays, GraduationCap } from 'lucide-react';
import { getOrganizerEvents } from '../services';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonList } from '../components/ui/Skeleton';
import { formatEventDate } from '../utils/constants';

export default function AdvisorDashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth context to resolve before doing anything
    if (authLoading) return;

    if (!user) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    const load = async () => {
      try {
        const res = await getOrganizerEvents(user.id);
        if (!cancelled && res?.success) setEvents(res.events);
      } catch (e) {
        console.error('AdvisorDashboard load failed:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [user, authLoading]);

  if (loading) return <div className="container"><SkeletonList count={3} /></div>;

  return (
    <div className="container animate-fade-in">
      <PageHeader
        title="Advisor Dashboard"
        subtitle={profile?.university ? `${profile.university} Advisor` : 'Event Advisor'}
        actions={
          <Link to="/submit" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Plus size={16} /> New Event
            </Button>
          </Link>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div className="brutal-border" style={{ padding: 24, background: 'var(--white)', boxShadow: 'var(--shadow)' }}>
          <GraduationCap size={24} style={{ marginBottom: 8 }} />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800 }}>{events.length}</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase' }}>Your Events</div>
        </div>
        <div className="brutal-border" style={{ padding: 24, background: 'var(--white)', boxShadow: 'var(--shadow)' }}>
          <FileText size={24} style={{ marginBottom: 8 }} />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800 }}>{events.filter(e => e.approved).length}</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase' }}>Approved</div>
        </div>
        <div className="brutal-border" style={{ padding: 24, background: 'var(--white)', boxShadow: 'var(--shadow)' }}>
          <CalendarDays size={24} style={{ marginBottom: 8 }} />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800 }}>{events.filter(e => new Date(e.date_time) > new Date()).length}</div>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: 14, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase' }}>Upcoming</div>
        </div>
      </div>

      {events.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No events yet"
          description="Submit your first event to get started."
          action={
            <Link to="/submit" style={{ textDecoration: 'none' }}>
              <Button variant="primary">Create Event</Button>
            </Link>
          }
        />
      ) : (
        <div>
          <h2 className="section-heading">Your Events</h2>
          {events.map(event => (
            <div key={event.id} className="list-item">
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 16 }}>{event.title}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--gray-500)', marginTop: 4 }}>
                  {formatEventDate(event.date_time)} &mdash; {event.university}
                </div>
              </div>
              <div className="list-item-actions">
                <Link to={`/events/${event.id}`} style={{ textDecoration: 'none' }}>
                  <Button variant="outline" size="sm">View</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
