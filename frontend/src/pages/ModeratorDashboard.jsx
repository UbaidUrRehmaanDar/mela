import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  checkModeratorStatus, 
  getPendingSubmissions, 
  approveEvent, 
  rejectEvent,
  getCurrentUser 
} from '../services';
import { formatEventDate } from '../utils/constants';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export default function ModeratorDashboard() {
  const [isModerator, setIsModerator] = useState(false);
  const [universities, setUniversities] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState('');
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const navigate = useNavigate();

  const fetchSubmissions = useCallback(async (unis) => {
    const result = await getPendingSubmissions(unis);
    if (result.success) {
      setSubmissions(result.submissions);
    }
    setLoading(false);
  }, []);

  const checkModStatus = useCallback(async () => {
    setLoading(true);
    const statusResult = await checkModeratorStatus();
    
    if (statusResult.success && statusResult.isModerator) {
      setIsModerator(true);
      setUniversities(statusResult.universities);
      fetchSubmissions(statusResult.universities);
    } else {
      setMessage('⚠️ You are not a moderator. Access denied.');
      setLoading(false);
    }
  }, [fetchSubmissions]);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    checkModStatus();
  }, [navigate, checkModStatus]);

  const handleApprove = async (submissionId) => {
    if (!confirm('Are you sure you want to approve this event?')) return;
    
    setActionLoading(submissionId);
    const result = await approveEvent(submissionId);
    
    if (result.success) {
      setMessage('✓ Event approved successfully!');
      fetchSubmissions(universities);
    } else {
      setMessage(`Error: ${result.error}`);
    }
    
    setActionLoading(null);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleReject = async (submissionId) => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setActionLoading(submissionId);
    const result = await rejectEvent(submissionId, rejectionReason);
    
    if (result.success) {
      setMessage('Event rejected');
      setRejectingId(null);
      setRejectionReason('');
      fetchSubmissions(universities);
    } else {
      setMessage(`Error: ${result.error}`);
    }
    
    setActionLoading(null);
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  if (!isModerator) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
        <div style={{ 
          padding: '2rem', 
          background: 'var(--mela-pink)', 
          border: '3px solid black',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <h2>Access Denied</h2>
          <p style={{ marginTop: '1rem' }}>{message}</p>
          <Button variant="primary" onClick={() => navigate('/events')} style={{ marginTop: '2rem' }}>
            Go to Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <h1 style={{ fontSize: '2.5rem', textTransform: 'uppercase', marginBottom: '1rem', borderBottom: '4px solid black', paddingBottom: '1rem' }}>
        👑 Moderator HQ
      </h1>
      
      <div style={{ 
        padding: '1rem', 
        background: 'var(--mela-yellow)', 
        border: '3px solid black',
        marginBottom: '2rem',
        fontWeight: 700
      }}>
        Moderating: {universities.join(', ')}
      </div>

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

      {submissions.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem', 
          background: 'var(--mela-white)',
          border: '3px solid black'
        }}>
          <h2>No pending submissions</h2>
          <p style={{ marginTop: '1rem', color: '#666' }}>
            All caught up! Check back later.
          </p>
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
              style={{ background: 'var(--mela-yellow)' }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  <Badge color="var(--mela-white)">Pending</Badge>
                  <span style={{ fontWeight: 700, marginLeft: '1rem' }}>{submission.university}</span>
                </div>
                
                <h3 style={{ fontSize: '1.5rem', textTransform: 'uppercase', fontWeight: 900, marginBottom: '0.5rem' }}>
                  {submission.title}
                </h3>
                
                <p style={{ marginBottom: '0.5rem', color: '#333' }}>
                  {submission.description}
                </p>
                
                <p style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                  📅 {formatEventDate(submission.dateTime)}
                  {submission.venue && ` • 📍 ${submission.venue}`}
                </p>
                
                <p style={{ fontSize: '0.85rem' }}>
                  By: {submission.organizerEmail}
                </p>

                {submission.posterURL && (
                  <div style={{ marginTop: '1rem' }}>
                    <img 
                      src={submission.posterURL} 
                      alt="Event poster"
                      style={{ 
                        maxWidth: '200px', 
                        border: '2px solid black',
                        display: 'block'
                      }}
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
                        width: '100%',
                        padding: '0.75rem',
                        border: '3px solid black',
                        fontFamily: 'inherit',
                        fontWeight: 700,
                        minHeight: '80px'
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
                      style={{ width: '150px' }}
                    >
                      {actionLoading === submission.id ? 'Rejecting...' : 'Confirm Reject'}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setRejectingId(null);
                        setRejectionReason('');
                      }}
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
                      style={{ width: '150px' }}
                    >
                      {actionLoading === submission.id ? 'Approving...' : 'Approve'}
                    </Button>
                    <Button 
                      variant="danger" 
                      onClick={() => setRejectingId(submission.id)}
                      style={{ width: '150px' }}
                    >
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
