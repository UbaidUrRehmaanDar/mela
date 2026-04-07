import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMySubmissions, deleteSubmission, getCurrentUser } from '../services';
import { formatEventDate } from '../utils/constants';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

export default function MySubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    const result = await getMySubmissions();
    if (result.success) {
      setSubmissions(result.submissions);
    } else {
      setMessage(`Error: ${result.error}`);
    }
    setLoading(false);
  };

  const handleDelete = async (submissionId) => {
    if (!confirm('Are you sure you want to delete this rejected submission?')) {
      return;
    }

    const result = await deleteSubmission(submissionId);
    if (result.success) {
      setMessage('Submission deleted ✓');
      fetchSubmissions();
    } else {
      setMessage(`Error: ${result.error}`);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'var(--mela-yellow)',
      rejected: 'var(--mela-pink)',
    };
    return <Badge color={colors[status]}>{status.toUpperCase()}</Badge>;
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Loading your submissions...</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <div className="flex-between" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', textTransform: 'uppercase', borderBottom: '4px solid black', paddingBottom: '1rem' }}>
          My Submissions
        </h1>
        <Button variant="primary" onClick={() => navigate('/submit')}>
          + New Event
        </Button>
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
          <h2 style={{ marginBottom: '1rem' }}>No submissions yet</h2>
          <p style={{ marginBottom: '2rem', color: '#666' }}>
            Submit your first event to get started!
          </p>
          <Button variant="primary" onClick={() => navigate('/submit')}>
            Submit Event
          </Button>
        </div>
      ) : (
        <div>
          {submissions.map((submission) => (
            <div 
              key={submission.id}
              className="list-item brutal-border brutal-hover" 
              style={{ 
                background: submission.status === 'pending' ? 'var(--mela-yellow)' : 'var(--mela-white)',
                opacity: submission.status === 'rejected' ? 0.7 : 1
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: '0.5rem' }}>
                  {getStatusBadge(submission.status)}
                  <span style={{ fontWeight: 700, marginLeft: '1rem' }}>{submission.university}</span>
                </div>
                
                <h3 style={{ fontSize: '1.5rem', textTransform: 'uppercase', fontWeight: 900, marginBottom: '0.5rem' }}>
                  {submission.title}
                </h3>
                
                <p style={{ marginBottom: '0.5rem', color: '#666' }}>
                  {submission.description.substring(0, 100)}...
                </p>
                
                <p style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                  📅 {formatEventDate(submission.dateTime)}
                </p>

                {submission.status === 'rejected' && submission.rejectionReason && (
                  <div style={{ 
                    marginTop: '1rem',
                    padding: '1rem',
                    background: 'var(--mela-pink)',
                    border: '2px solid black',
                    fontSize: '0.9rem'
                  }}>
                    <strong>Rejection Reason:</strong> {submission.rejectionReason}
                  </div>
                )}
              </div>

              <div className="list-item-actions">
                {submission.status === 'pending' && (
                  <Button variant="outline">Edit</Button>
                )}
                {submission.status === 'rejected' && (
                  <Button variant="danger" onClick={() => handleDelete(submission.id)}>
                    Delete
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
