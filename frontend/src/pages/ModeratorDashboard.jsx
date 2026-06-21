import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CalendarDays, MapPin, CheckCircle, XCircle } from 'lucide-react';
import {
  checkModeratorStatus,
  getPendingSubmissions,
  approveEvent,
  rejectEvent,
} from '../services';
import { useAuth } from '../context/AuthContext';
import { formatEventDate } from '../utils/constants';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonList } from '../components/ui/Skeleton';
import { useToast } from '../components/ui/Toast';
import { useConfirm } from '../components/ui/ConfirmDialog';

export default function ModeratorDashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const [isModerator, setIsModerator] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { confirm } = useConfirm();

  const showMessage = (text, type = 'success') => toast(text, type);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/login'); return; }
    checkModStatus();
  }, [user, authLoading]);

  const checkModStatus = async () => {
    setLoading(true);
    const statusResult = await checkModeratorStatus();

    if (statusResult.success && statusResult.isModerator) {
      setIsModerator(true);
      setIsAdmin(statusResult.isAdmin || false);
      setUniversities(statusResult.universities);
      fetchSubmissions(statusResult.universities);
    } else {
      showMessage('You are not a moderator. Access denied.', 'error');
      setLoading(false);
    }
  };

  const fetchSubmissions = async (unis) => {
    const result = await getPendingSubmissions(unis);
    if (result.success) setSubmissions(result.submissions);
    setLoading(false);
  };

  const handleApprove = async (submissionId) => {
    const ok = await confirm({
      title: 'Approve event?',
      message: 'This event will go live on the public feed.',
      confirmLabel: 'Approve',
    });
    if (!ok) return;

    setActionLoading(submissionId);
    const result = await approveEvent(submissionId);

    if (result.success) {
      showMessage('Event approved successfully');
      fetchSubmissions(universities);
    } else {
      showMessage(result.error, 'error');
    }
    setActionLoading(null);
  };

  const handleReject = async (submissionId) => {
    if (!rejectionReason.trim()) {
      toast('Please provide a reason for rejection', 'error');
      return;
    }

    setActionLoading(submissionId);
    const result = await rejectEvent(submissionId, rejectionReason);

    if (result.success) {
      showMessage('Event rejected');
      setRejectingId(null);
      setRejectionReason('');
      fetchSubmissions(universities);
    } else {
      showMessage(result.error, 'error');
    }
    setActionLoading(null);
  };

  if (!isModerator && !loading) {
    return (
      <div className="container" style={{ maxWidth: '900px' }}>
        <PageHeader title="Moderator HQ" subtitle="Access restricted to moderators." />
        <EmptyState
          icon={ShieldCheck}
          title="Access denied"
          description="You do not have moderator permissions for this area."
          action={<Button variant="primary" onClick={() => navigate('/events')}>Go to Events</Button>}
        />
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '900px' }}>
      <PageHeader
        title="Moderator HQ"
        subtitle={
          loading
            ? 'Loading submissions...'
            : isAdmin
              ? 'Reviewing all pending submissions across all universities'
              : `Reviewing submissions for ${universities.join(', ')}`
        }
      />

      {loading ? (
        <SkeletonList count={5} />
      ) : (
      <>
      <div className="info-banner">
        {isAdmin ? 'Admin view — all universities' : `Moderating: ${universities.join(', ')}`}
      </div>

      {submissions.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '4rem',
          background: 'var(--white)', border: '3px solid black'
        }}>
          <h2>No pending submissions</h2>
          <p style={{ marginTop: '1rem', color: 'var(--gray-600)' }}>All caught up! Check back later.</p>
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '1rem', fontWeight: 700, fontSize: '1.1rem' }}>
            {submissions.length} Pending Submission{submissions.length !== 1 ? 's' : ''}
          </div>

          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="list-item brutal-border brutal-hover"
              style={{ background: 'var(--yellow)' }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <Badge color="var(--white)">Pending</Badge>
                  <span style={{ fontWeight: 700, marginLeft: '1rem' }}>{submission.university}</span>
                </div>

                <h3 style={{ fontSize: '1.5rem', textTransform: 'uppercase', fontWeight: 900, marginBottom: '0.5rem' }}>
                  {submission.title}
                </h3>

                <p style={{ marginBottom: '0.5rem', color: 'var(--gray-600)' }}>{submission.description}</p>

                <p style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <CalendarDays size={14} /> {formatEventDate(submission.dateTime)}
                  </span>
                  {submission.venue && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <MapPin size={14} /> {submission.venue}
                    </span>
                  )}
                </p>

                <p style={{ fontSize: '0.85rem' }}>By: {submission.organizerEmail || submission.organizer_email}</p>

                {(submission.posterURL || submission.poster_url) && (
                  <div style={{ marginTop: '1rem' }}>
                    <img
                      src={submission.posterURL || submission.poster_url}
                      alt="Event poster"
                      style={{ maxWidth: '200px', border: '2px solid black', display: 'block' }}
                    />
                  </div>
                )}

                {rejectingId === submission.id && (
                  <div style={{ marginTop: '1rem' }}>
                    <textarea
                      placeholder="Reason for rejection..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      style={{
                        width: '100%', padding: '0.75rem',
                        border: '3px solid black', fontFamily: 'inherit',
                        fontWeight: 700, minHeight: '80px'
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="list-item-actions" style={{ flexDirection: 'column', gap: '0.5rem' }}>
                {rejectingId === submission.id ? (
                  <>
                    <Button
                      variant="danger"
                      onClick={() => handleReject(submission.id)}
                      disabled={actionLoading === submission.id}
                      style={{ width: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                    >
                      <XCircle size={16} />
                      {actionLoading === submission.id ? 'Rejecting...' : 'Confirm'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => { setRejectingId(null); setRejectionReason(''); }}
                      style={{ width: '150px' }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="success"
                      onClick={() => handleApprove(submission.id)}
                      disabled={actionLoading === submission.id}
                      style={{ width: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                    >
                      <CheckCircle size={16} />
                      {actionLoading === submission.id ? 'Approving...' : 'Approve'}
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => setRejectingId(submission.id)}
                      style={{ width: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                    >
                      <XCircle size={16} /> Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      </>
      )}
    </div>
  );
}
