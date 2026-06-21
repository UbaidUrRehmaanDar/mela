import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, GraduationCap, LogOut, FileText } from 'lucide-react';
import { updateUserProfile, logOut, getUserApplication } from '../services';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import PageHeader from '../components/ui/PageHeader';
import { SkeletonList } from '../components/ui/Skeleton';
import { SIGNUP_UNIVERSITY_OPTIONS } from '../utils/constants';

const INTEREST_CATEGORIES = [
  'Technology',
  'Artificial Intelligence',
  'Software Development',
  'Business',
  'Entrepreneurship',
  'Arts',
  'Design',
  'Sports',
  'Medical Sciences',
  'Engineering',
  'Research',
  'Community Service'
];

export default function Profile() {
  const { user, profile: ctxProfile, refreshProfile } = useAuth();
  const [profile, setProfile] = useState(ctxProfile);
  const [loading, setLoading] = useState(!ctxProfile);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [formData, setFormData] = useState({
    displayName: ctxProfile?.displayName || ctxProfile?.display_name || '',
    university: ctxProfile?.university || '',
    interests: ctxProfile?.interests || [],
  });
  const [application, setApplication] = useState(null);
  const [appLoading, setAppLoading] = useState(false);
  const navigate = useNavigate();

  // Sync local profile state when context profile loads/changes
  useEffect(() => {
    if (ctxProfile && !profile) {
      setProfile(ctxProfile);
      setFormData({
        displayName: ctxProfile.displayName || ctxProfile.display_name || '',
        university: ctxProfile.university || '',
        interests: ctxProfile.interests || [],
      });
      setLoading(false);
    }
  }, [ctxProfile, profile]);

  // Load organizer application status for students
  useEffect(() => {
    if (!user || !profile) return;
    if (profile.role === 'student') {
      setAppLoading(true);
      getUserApplication(user.id).then((appRes) => {
        if (appRes.success) setApplication(appRes.application);
        setAppLoading(false);
      });
    }
  }, [user, profile]);

  const reloadProfile = async () => {
    const fresh = await refreshProfile();
    if (fresh) {
      setProfile(fresh);
      setFormData({
        displayName: fresh.displayName || fresh.display_name || '',
        university: fresh.university || '',
        interests: fresh.interests || [],
      });
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleInterestCheckboxChange = (category) => {
    const current = [...formData.interests];
    const idx = current.indexOf(category);
    if (idx > -1) {
      current.splice(idx, 1);
    } else {
      current.push(category);
    }
    setFormData({ ...formData, interests: current });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const result = await updateUserProfile(user.id, formData);
    if (result.success) {
      setMessage('Profile updated successfully');
      setMessageType('success');
      setEditing(false);
      reloadProfile();
    } else {
      setMessage(result.error);
      setMessageType('error');
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    const result = await logOut();
    if (result.success) navigate('/');
  };

  return (
    <div className="container animate-fade-in">
      <PageHeader
        title="Profile"
        subtitle={loading ? 'Loading profile...' : profile?.email}
        actions={
          !loading && (
            <Button
              variant="outline"
              className="sm"
              onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <LogOut size={15} /> Logout
            </Button>
          )
        }
      />

      {loading ? (
        <SkeletonList count={3} />
      ) : (
      <div className="profile-card" style={{ maxWidth: '640px', margin: '0 auto' }}>

        {message && (
          <div className={`alert ${messageType === 'error' ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        {profile ? (
          <div>
            <div style={{
              padding: '1.5rem',
              background: 'var(--yellow)',
              border: 'var(--border)',
              marginBottom: '2rem'
            }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {profile.email}
              </div>
              <div style={{
                padding: '0.5rem 1rem',
                background: profile.role === 'moderator' ? 'var(--orange)' : profile.role === 'admin' ? 'var(--pink)' : profile.role === 'advisor' ? 'var(--purple)' : 'var(--white)',
                border: 'var(--border-thin)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                fontSize: '0.9rem'
              }}>
                {profile.role === 'moderator' ? <ShieldCheck size={16} /> : <GraduationCap size={16} />}
                {profile.role === 'moderator' ? 'Moderator' : profile.role === 'admin' ? 'Admin' : profile.role === 'advisor' ? 'Advisor' : 'Student'}
              </div>
              {(profile.role === 'moderator' || profile.role === 'advisor') && profile.moderatorFor?.length > 0 && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  <strong>Associated Campuses:</strong> {profile.moderatorFor.join(', ')}
                </div>
              )}
            </div>

            {profile.role === 'student' && !editing && (
              <div className="info-banner" style={{
                background: application?.status === 'pending'
                  ? 'var(--yellow)'
                  : application?.status === 'rejected'
                    ? 'var(--error)'
                    : 'var(--cyan)',
                color: application?.status === 'rejected' ? 'white' : 'black',
              }}>
                <h3 style={{ textTransform: 'uppercase', fontWeight: 900, marginBottom: '0.5rem', fontSize: '1.2rem' }}>
                  {application
                    ? `Organizer Application: ${application.status}`
                    : 'Become an Organizer'}
                </h3>
                {application?.status === 'pending' && (
                  <p style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                    Your application for <strong>{application.societyName || application.society_name}</strong> at <strong>{application.university}</strong> is currently pending admin review.
                  </p>
                )}
                {application?.status === 'rejected' && (
                  <div>
                    <p style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>
                      Rejection Reason: <em>{application.feedback || 'No feedback provided.'}</em>
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/apply-organizer')}
                      style={{ border: '2px solid black', fontWeight: 800, color: 'black' }}
                    >
                      Re-Apply Now
                    </Button>
                  </div>
                )}
                {!application && !appLoading && (
                  <div>
                    <p style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem' }}>
                      Are you a society representative? Apply to get event submission and moderation rights for your university campus.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/apply-organizer')}
                      style={{ border: '2px solid black', fontWeight: 800 }}
                    >
                      Apply Now
                    </Button>
                  </div>
                )}
              </div>
            )}

            {!editing ? (
              <div>
                <div className="input-group">
                  <label>Display Name</label>
                  <div style={{ padding: '1rem', background: 'var(--off-white)', border: 'var(--border)', fontWeight: 700 }}>
                    {profile.displayName || profile.display_name || 'Not set'}
                  </div>
                </div>
                <div className="input-group">
                  <label>University</label>
                  <div style={{ padding: '1rem', background: 'var(--off-white)', border: 'var(--border)', fontWeight: 700 }}>
                    {profile.university || 'Not set'}
                  </div>
                </div>
                <div className="input-group">
                  <label>My Interests</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.2rem' }}>
                    {profile.interests && profile.interests.length > 0 ? (
                      profile.interests.map(interest => (
                        <span key={interest} className="interest-tag selected">
                          {interest}
                        </span>
                      ))
                    ) : (
                      <span style={{ color: 'var(--gray-600)', fontWeight: 700, fontSize: '0.95rem' }}>No interests selected. Click Edit Profile to choose your preferences!</span>
                    )}
                  </div>
                </div>
                <Button variant="primary" onClick={() => setEditing(true)} style={{ width: '100%', marginTop: '1rem' }}>
                  Edit Profile
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSave}>
                <Input
                  label="Display Name"
                  name="displayName"
                  placeholder="Your Name"
                  value={formData.displayName}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="University"
                  name="university"
                  type="select"
                  options={SIGNUP_UNIVERSITY_OPTIONS}
                  value={formData.university}
                  onChange={handleChange}
                  required
                />
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Interests & Preferences
                  </label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                    gap: '12px',
                    background: 'var(--off-white)',
                    border: 'var(--border)',
                    padding: '16px',
                    maxHeight: '220px',
                    overflowY: 'auto',
                  }}>
                    {INTEREST_CATEGORIES.map((category) => (
                      <label key={category} className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.interests?.includes(category)}
                          onChange={() => handleInterestCheckboxChange(category)}
                        />
                        {category}
                      </label>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <Button variant="primary" type="submit" disabled={saving} style={{ flex: 1 }}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="outline" onClick={() => { setEditing(false); setMessage(''); }} style={{ flex: 1 }}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <p style={{ textAlign: 'center', padding: '2rem', fontWeight: 700 }}>
            Could not load profile data.
          </p>
        )}
      </div>
      )}
    </div>
  );
}
