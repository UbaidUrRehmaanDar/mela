import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getCurrentUserProfile, updateUserProfile, logOut } from '../services';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    displayName: '',
    university: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setUser(currentUser);
    const profileResult = await getCurrentUserProfile();
    if (profileResult) {
      setProfile(profileResult);
      setFormData({
        displayName: profileResult.displayName || '',
        university: profileResult.university || ''
      });
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const result = await updateUserProfile(user.uid, formData);
    
    if (result.success) {
      setMessage('Profile updated successfully! ✓');
      setEditing(false);
      fetchProfile();
    } else {
      setMessage(`Error: ${result.error}`);
    }
    
    setSaving(false);
  };

  const handleLogout = async () => {
    const result = await logOut();
    if (result.success) {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Loading profile...</h2>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="form-container brutal-border" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <div className="form-tape"></div>
        
        <div className="flex-between" style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', textTransform: 'uppercase' }}>
            My Profile
          </h1>
          <Button variant="danger" onClick={handleLogout}>
            Logout
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

        {profile && (
          <div>
            <div style={{ 
              padding: '1.5rem', 
              background: 'var(--mela-yellow)', 
              border: '3px solid black',
              marginBottom: '2rem'
            }}>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {profile.email}
              </div>
              <div style={{ 
                padding: '0.5rem 1rem', 
                background: profile.role === 'moderator' ? 'var(--mela-orange)' : 'var(--mela-white)',
                border: '2px solid black',
                display: 'inline-block',
                fontWeight: 700,
                textTransform: 'uppercase',
                fontSize: '0.9rem'
              }}>
                {profile.role === 'moderator' ? '👑 Moderator' : '🎓 Student'}
              </div>
              {profile.role === 'moderator' && profile.moderatorFor && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  <strong>Moderates:</strong> {profile.moderatorFor.join(', ')}
                </div>
              )}
            </div>

            {!editing ? (
              <div>
                <div className="input-group">
                  <label>Display Name</label>
                  <div style={{ 
                    padding: '1rem', 
                    background: '#f0f0f0',
                    border: '3px solid black',
                    fontWeight: 700
                  }}>
                    {profile.displayName || 'Not set'}
                  </div>
                </div>

                <div className="input-group">
                  <label>University</label>
                  <div style={{ 
                    padding: '1rem', 
                    background: '#f0f0f0',
                    border: '3px solid black',
                    fontWeight: 700
                  }}>
                    {profile.university || 'Not set'}
                  </div>
                </div>

                <Button 
                  variant="primary" 
                  onClick={() => setEditing(true)}
                  style={{ width: '100%', marginTop: '1rem' }}
                >
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
                  options={['', 'FAST NUCES', 'LUMS', 'PUCIT', 'UET', 'Punjab University', 'NUST', 'COMSATS', 'Other']}
                  value={formData.university}
                  onChange={handleChange}
                  required
                />

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={saving}
                    style={{ flex: 1 }}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEditing(false);
                      setMessage('');
                    }}
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
