import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarX, CalendarDays, MapPin, ExternalLink, Trash2 } from 'lucide-react';
import { getUserRegistrations, unregisterFromEvent } from '../services';
import { useAuth } from '../context/AuthContext';
import { formatEventDate } from '../utils/constants';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonList } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';
import { useConfirm } from '../components/ui/ConfirmDialog';

export default function MyRegistrations() {
  const { user, loading: authLoading } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { confirm } = useConfirm();

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login'); return; }
    fetchRegistrations();
  }, [user, authLoading]);


  const fetchRegistrations = async () => {
    setLoading(true);
    const result = await getUserRegistrations();
    if (result.success) {
      setRegistrations(result.registrations);
    } else {
      toast(result.error, 'error');
    }
    setLoading(false);
  };

  const handleUnregister = async (reg) => {
    const ok = await confirm({
      title: 'Cancel registration?',
      message: `Unregister from "${reg.event_title}"?`,
      confirmLabel: 'Unregister',
      variant: 'danger',
    });
    if (!ok) return;

    const result = await unregisterFromEvent(reg.event_id);
    if (result.success) {
      toast('Registration cancelled');
      fetchRegistrations();
    } else {
      toast(result.error, 'error');
    }
  };

  const now = new Date();
  const filtered = registrations.filter((r) => {
    if (filter === 'upcoming') return r.eventDateTime && r.eventDateTime >= now;
    if (filter === 'past') return r.eventDateTime && r.eventDateTime < now;
    return true;
  });

  const subtitle = loading
    ? 'Loading your registrations...'
    : `${filtered.length} registration${filtered.length !== 1 ? 's' : ''}`;

  return (
    <div className="container animate-fade-in">
      <PageHeader
        title="My Registrations"
        subtitle={subtitle}
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'My Registrations' }]}
        actions={
          !loading && registrations.length > 0 ? (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['all', 'upcoming', 'past'].map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Button>
              ))}
            </div>
          ) : null
        }
      />

      {loading ? (
        <SkeletonList count={4} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={CalendarX}
          title={filter === 'all' ? 'No registrations yet' : `No ${filter} registrations`}
          description={filter === 'all' ? 'Browse events and register for ones you like.' : `You have no ${filter} event registrations.`}
          action={<Button variant="primary" onClick={() => navigate('/events')}>Browse Events</Button>}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map((reg) => (
            <div key={reg.id} className="brutal-border" style={{
              background: reg.eventDateTime && reg.eventDateTime < now ? 'var(--off-white)' : 'white',
              padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', flexWrap: 'wrap', gap: '1rem',
              opacity: reg.eventDateTime && reg.eventDateTime < now ? 0.7 : 1,
            }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '0.3rem' }}>
                  {reg.event_title}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.9rem', fontWeight: 700, color: 'var(--gray-600)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <CalendarDays size={14} /> {formatEventDate(reg.eventDateTime)}
                  </span>
                  {reg.event_university && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin size={14} /> {reg.event_university}
                    </span>
                  )}
                  {reg.eventDateTime && reg.eventDateTime < now && (
                    <Badge className="badge-other">Past</Badge>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/events/${reg.event_id}`)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <ExternalLink size={14} /> View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleUnregister(reg)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--pink)' }}
                >
                  <Trash2 size={14} /> Unregister
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
