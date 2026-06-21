import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookmarkX, Bell, Bookmark } from 'lucide-react';
import { getSavedEvents, unsaveEvent } from '../services';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/ui/EventCard';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonGrid } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';
import { useConfirm } from '../components/ui/ConfirmDialog';

export default function SavedEvents() {
  const { user, loading: authLoading } = useAuth();
  const [savedEvents, setSavedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { confirm } = useConfirm();

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login'); return; }
    fetchSavedEvents();
  }, [user, authLoading]);


  const fetchSavedEvents = async () => {
    setLoading(true);
    const result = await getSavedEvents();
    if (result.success) {
      setSavedEvents(result.savedEvents);
    } else {
      toast(result.error, 'error');
    }
    setLoading(false);
  };

  const handleUnsave = async (eventId, title) => {
    const ok = await confirm({
      title: 'Remove from saved?',
      message: `"${title}" will be removed from your wishlist.`,
      confirmLabel: 'Remove',
      variant: 'danger',
    });
    if (!ok) return;

    const result = await unsaveEvent(eventId);
    if (result.success) {
      toast('Event removed from saved');
      fetchSavedEvents();
    } else {
      toast(result.error, 'error');
    }
  };

  const subtitle = loading
    ? 'Loading your wishlist...'
    : `${savedEvents.length} event${savedEvents.length !== 1 ? 's' : ''} saved`;

  return (
    <div className="container animate-fade-in">
      <PageHeader
        title="Wishlist"
        subtitle={subtitle}
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Wishlist' }]}
      />

      {loading ? (
        <SkeletonGrid count={3} />
      ) : savedEvents.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved events yet"
          description="Browse events and save the ones you're interested in."
          action={<Button variant="primary" onClick={() => navigate('/events')}>Browse Events</Button>}
        />
      ) : (
        <>
          <div className="grid-3">
            {savedEvents.map((saved) => (
              <EventCard
                key={saved.id}
                event={saved}
                extraBadges={
                  saved.reminderSent ? (
                    <Badge className="badge-verified" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Bell size={11} /> Reminder
                    </Badge>
                  ) : null
                }
                footer={
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button
                      variant="outline"
                      className="sm"
                      onClick={() => navigate(`/events/${saved.eventId}`)}
                      style={{ flex: 1 }}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      className="sm"
                      onClick={() => handleUnsave(saved.eventId, saved.eventTitle)}
                      style={{ padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center' }}
                      title="Remove from saved"
                    >
                      <BookmarkX size={16} />
                    </Button>
                  </div>
                }
              />
            ))}
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Button variant="outline" onClick={() => navigate('/events')}>Browse More Events</Button>
          </div>
        </>
      )}
    </div>
  );
}
