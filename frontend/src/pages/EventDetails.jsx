import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  CalendarDays, MapPin, Bookmark, BookmarkCheck, ArrowLeft,
  ExternalLink, ThumbsUp, MessageSquare, Trash2, CalendarCheck2,
  CalendarX, Share2, Heart, ShieldAlert,
} from 'lucide-react';
import {
  getEventById, deleteEvent,
  saveEvent, isEventSaved, unsaveEvent,
  getComments, addComment, deleteComment,
  getLikeCount, hasLikedEvent, likeEvent, unlikeEvent,
  isRegisteredForEvent, registerForEvent, unregisterFromEvent,
  getEventRegistrations,
  getSaveCount,
} from '../services';
import { useAuth } from '../context/AuthContext';
import { formatEventDate } from '../utils/constants';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { IconButton } from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonLine } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';
import { useConfirm } from '../components/ui/ConfirmDialog';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, profile } = useAuth();
  const { toast } = useToast();
  const { confirm } = useConfirm();

  const isAdmin = profile?.role === 'admin';
  const isModerator = profile?.role === 'moderator';
  const isAdminOrMod = isAdmin || isModerator;

  const [event, setEvent]           = useState(null);
  const [loading, setLoading]       = useState(true);
  const [isSaved, setIsSaved]       = useState(false);
  const [saveCount, setSaveCount]   = useState(0);
  const [actionLoading, setActionLoading] = useState(false);
  const [comments, setComments]     = useState([]);
  const [newComment, setNewComment] = useState('');
  const [likeCount, setLikeCount]   = useState(0);
  const [hasLiked, setHasLiked]     = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [regCount, setRegCount]     = useState(0);

  useEffect(() => {
    let alive = true;

    async function init() {
      // Core data — always public
      const [eventRes, commentsRes, likesRes, saveCountRes] = await Promise.all([
        getEventById(id),
        getComments(id),
        getLikeCount(id),
        getSaveCount(id),
      ]);

      if (!alive) return;

      if (eventRes.success)    setEvent(eventRes.event);
      else toast('Event not found', 'error');
      if (commentsRes.success) setComments(commentsRes.comments);
      if (likesRes.success)    setLikeCount(likesRes.count);
      if (saveCountRes.success) setSaveCount(saveCountRes.count);

      setLoading(false);

      // User-specific data
      const regsRes = await getEventRegistrations(id);
      if (alive && regsRes.success) setRegCount(regsRes.registrations.length);

      if (currentUser) {
        const [savedRes, regRes, likedRes] = await Promise.all([
          isEventSaved(id),
          isRegisteredForEvent(id),
          hasLikedEvent(id),
        ]);
        if (!alive) return;
        if (savedRes.success) setIsSaved(savedRes.isSaved);
        if (regRes.success)   setIsRegistered(regRes.isRegistered);
        if (likedRes.success) setHasLiked(likedRes.hasLiked);
      }
    }

    init();
    return () => { alive = false; };
  }, [id, currentUser]);

  const showMessage = (text, type = 'success') => toast(text, type);

  /* ── save toggle ─────────────────────────────────────────── */
  const handleSaveToggle = async () => {
    if (!currentUser) { showMessage('Please log in to save events', 'error'); return; }
    setActionLoading(true);
    if (isSaved) {
      const res = await unsaveEvent(id);
      if (res.success) { setIsSaved(false); setSaveCount(p => Math.max(0, p - 1)); showMessage('Removed from wishlist'); }
      else showMessage(res.error, 'error');
    } else {
      const res = await saveEvent(id, event.title, event.dateTime);
      if (res.success) { setIsSaved(true); setSaveCount(p => p + 1); showMessage('Saved to wishlist'); }
      else showMessage(res.error, 'error');
    }
    setActionLoading(false);
  };

  /* ── like toggle ─────────────────────────────────────────── */
  const handleLikeToggle = async () => {
    if (!currentUser) { showMessage('Please log in to like events', 'error'); return; }
    if (hasLiked) {
      const res = await unlikeEvent(id);
      if (res.success) { setHasLiked(false); setLikeCount(p => Math.max(0, p - 1)); }
    } else {
      const res = await likeEvent(id);
      if (res.success) { setHasLiked(true); setLikeCount(p => p + 1); }
    }
  };

  /* ── register toggle ─────────────────────────────────────── */
  const handleRegisterToggle = async () => {
    if (!currentUser) { showMessage('Please log in to register', 'error'); return; }
    if (isRegistered) {
      const ok = await confirm({ title: 'Cancel registration?', message: 'You will lose your spot.', confirmLabel: 'Cancel Registration', variant: 'danger' });
      if (!ok) return;
      const res = await unregisterFromEvent(id);
      if (res.success) { setIsRegistered(false); showMessage('Registration cancelled'); }
      else showMessage(res.error, 'error');
    } else {
      const res = await registerForEvent(event);
      if (res.success) { setIsRegistered(true); showMessage('Registered successfully!'); }
      else showMessage(res.error, 'error');
    }
  };

  /* ── add comment ─────────────────────────────────────────── */
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!currentUser) { showMessage('Please log in to comment', 'error'); return; }
    if (!newComment.trim()) return;
    const res = await addComment(id, newComment);
    if (res.success) {
      setNewComment('');
      const fresh = await getComments(id);
      if (fresh.success) setComments(fresh.comments);
    } else showMessage(res.error, 'error');
  };

  /* ── delete comment ──────────────────────────────────────── */
  const handleDeleteComment = async (commentId) => {
    const ok = await confirm({ title: 'Delete comment?', message: 'This cannot be undone.', confirmLabel: 'Delete', variant: 'danger' });
    if (!ok) return;
    const res = await deleteComment(commentId);
    if (res.success) {
      setComments(prev => prev.filter(c => c.id !== commentId));
      showMessage('Comment deleted');
    } else showMessage(res.error, 'error');
  };

  /* ── delete event (admin) ────────────────────────────────── */
  const handleDeleteEvent = async () => {
    const ok = await confirm({
      title: 'Delete this event?',
      message: 'This will permanently remove the event and all its registrations, likes, and comments.',
      confirmLabel: 'Delete Event',
      variant: 'danger',
    });
    if (!ok) return;
    const res = await deleteEvent(id);
    if (res.success) {
      showMessage('Event deleted');
      navigate('/events');
    } else showMessage(res.error, 'error');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showMessage('Link copied to clipboard', 'info');
  };

  /* ── loading skeleton ────────────────────────────────────── */
  if (loading) {
    return (
      <div className="container-narrow">
        <div className="skeleton-card" aria-busy="true">
          <SkeletonLine className="sm" />
          <SkeletonLine className="lg" />
          <div className="skeleton" style={{ height: 220, margin: '24px 0' }} />
          <SkeletonLine className="md" />
          <SkeletonLine className="md" />
          <SkeletonLine className="sm" />
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container-narrow">
        <EmptyState
          icon={CalendarX}
          title="Event not found"
          description="This event may have been removed or the link is incorrect."
          action={<Button variant="primary" onClick={() => navigate('/events')}>Back to Events</Button>}
        />
      </div>
    );
  }

  const isFull = event.participantLimit && regCount >= event.participantLimit;

  // Who can delete a comment: the comment author, the event organizer, or an admin
  const canDeleteComment = (comment) =>
    currentUser && (
      currentUser.id === comment.user_id ||
      currentUser.id === event.organizer_id ||
      isAdmin
    );

  return (
    <div className="container-narrow animate-fade-in">
      <nav className="page-breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true">›</span>
        <Link to="/events">Events</Link>
        <span aria-hidden="true">›</span>
        <span>{event.university}</span>
        <span aria-hidden="true">›</span>
        <span>{event.title}</span>
      </nav>

      {/* Admin danger bar */}
      {isAdmin && (
        <div style={{
          background: 'var(--pink)', border: '3px solid black', padding: '12px 16px',
          marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: '4px 4px 0 black', flexWrap: 'wrap', gap: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: 14 }}>
            <ShieldAlert size={16} /> Admin View
          </div>
          <Button variant="danger" size="sm" onClick={handleDeleteEvent}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Trash2 size={14} /> Delete This Event
          </Button>
        </div>
      )}

      <article className="event-detail-card">
        {(event.posterURL || event.poster_url) ? (
          <img src={event.posterURL || event.poster_url} alt={`Event poster for ${event.title}`} className="event-detail-poster" />
        ) : (
          <div className="event-detail-poster-fallback" style={{ background: 'var(--yellow)' }}>
            <h2 className="font-display" style={{ fontSize: '2rem', opacity: 0.6 }}>{event.title}</h2>
          </div>
        )}

        <div className="event-detail-body">
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <Badge category={event.category}>{event.category}</Badge>
            <Badge className="badge-verified">{event.university}</Badge>
            {isRegistered && <Badge className="badge-registered">Registered</Badge>}
          </div>

          <h1 className="event-detail-title">{event.title}</h1>

          {/* Public stats — always visible */}
          <div className="event-detail-meta">
            <span><CalendarDays size={18} aria-hidden="true" /> {formatEventDate(event.dateTime)}</span>
            {event.venue && <span><MapPin size={18} aria-hidden="true" /> {event.venue}</span>}
            <span><CalendarCheck2 size={16} aria-hidden="true" /> {regCount} registered</span>
            <span><ThumbsUp size={16} aria-hidden="true" /> {likeCount} likes</span>
            <span><Heart size={16} aria-hidden="true" /> {saveCount} wishlisted</span>
          </div>

          <section>
            <h2 className="text-subsection" style={{ marginBottom: '16px' }}>About This Event</h2>
            <p className="event-detail-description">{event.description}</p>
          </section>

          <div className="event-detail-organizer">
            <strong className="font-ui">Event Organizer:</strong>{' '}
            <span className="font-body">{event.organizerEmail || event.organizer_email}</span>
            <Badge className="badge-verified" style={{ marginLeft: '8px' }}>Verified</Badge>
          </div>

          {event.participantLimit && (
            <div className={`event-detail-spots ${isFull ? 'full' : 'available'}`}>
              {regCount} / {event.participantLimit} spots filled
              {isFull && ' — Event is full'}
            </div>
          )}

          {(event.eventURL || event.event_url) && (
            <a href={event.eventURL || event.event_url} target="_blank" rel="noopener noreferrer" className="event-detail-link-card">
              <ExternalLink size={18} aria-hidden="true" />
              Visit Official Event Website
            </a>
          )}

          <div className="event-detail-actions">
            {/* Register — hidden for admin/moderator */}
            {!isAdminOrMod && (
              <Button
                variant={isRegistered ? 'success' : 'primary'}
                onClick={handleRegisterToggle}
                disabled={isFull && !isRegistered}
                style={{ flex: 2, minWidth: '200px' }}
              >
                <CalendarCheck2 size={18} aria-hidden="true" />
                {isRegistered ? 'Registered ✓' : 'Register Now'}
              </Button>
            )}

            {/* Save — hidden for admin/moderator */}
            {!isAdminOrMod && (
              <IconButton onClick={handleSaveToggle} disabled={actionLoading}
                wishlist={isSaved} aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'}>
                {isSaved ? <BookmarkCheck size={22} /> : <Bookmark size={22} />}
              </IconButton>
            )}

            {/* Like — hidden for admin/moderator */}
            {!isAdminOrMod && (
              <IconButton onClick={handleLikeToggle} active={hasLiked} aria-label="Like event">
                <ThumbsUp size={22} fill={hasLiked ? 'currentColor' : 'none'} />
              </IconButton>
            )}

            <IconButton onClick={handleShare} aria-label="Share event">
              <Share2 size={22} />
            </IconButton>

            <Button variant="outline" onClick={() => navigate('/events')} style={{ minWidth: 'auto' }}>
              <ArrowLeft size={16} aria-hidden="true" /> Back
            </Button>
          </div>

          {/* ── Comments ──────────────────────────────────── */}
          <section className="comments-section">
            <h2 className="comments-title">
              <MessageSquare size={24} aria-hidden="true" />
              What Others Are Saying ({comments.length})
            </h2>

            <form onSubmit={handleAddComment} className="comment-form">
              <input
                type="text"
                placeholder={currentUser && !isAdminOrMod ? 'Write a comment...' : isAdminOrMod ? 'Admins & moderators cannot post comments' : 'Log in to post comments!'}
                disabled={!currentUser || isAdminOrMod}
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                aria-label="Comment text"
              />
              <Button
                variant="primary"
                type="submit"
                disabled={!currentUser || isAdminOrMod || !newComment.trim()}
                style={{ minWidth: 'auto' }}
              >
                Post
              </Button>
            </form>

            {comments.length === 0 ? (
              <p className="comment-empty">No comments yet. Start the conversation!</p>
            ) : (
              <div className="comments-list">
                {comments.map(comment => (
                  <div key={comment.id} className="comment-card">
                    <div>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
                        <span className="comment-author">{comment.displayName}</span>
                        <span className="comment-time">
                          {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Just now'}
                        </span>
                      </div>
                      <p className="comment-text">{comment.content}</p>
                    </div>

                    {canDeleteComment(comment) && (
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(comment.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--error)', padding: '4px' }}
                        title="Delete comment"
                        aria-label="Delete comment"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </article>
    </div>
  );
}
