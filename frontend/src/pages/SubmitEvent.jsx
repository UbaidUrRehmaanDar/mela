import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Upload, CheckCircle, AlertCircle, ShieldCheck, GraduationCap } from 'lucide-react';
import { submitEvent } from '../services';
import { validateEventData, isValidImageFile, isFileSizeValid, EVENT_UNIVERSITIES, CATEGORIES, USER_ROLES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const CAN_SUBMIT_ROLES = [USER_ROLES.ADVISOR, USER_ROLES.MODERATOR, USER_ROLES.ADMIN];

const EMPTY_FORM = { title: '', description: '', dateTime: '', university: '', category: '', venue: '', eventURL: '' };

export default function SubmitEvent() {
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [posterFile, setPosterFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [errors, setErrors] = useState({});
  const [profileUniversity, setProfileUniversity] = useState(null);
  const navigate = useNavigate();
  const mountedRef = useRef(true);

  // Pre-fill university from profile (context, no extra fetch needed)
  useEffect(() => {
    if (profile?.university && profile.university !== 'Free / Not in University' && EVENT_UNIVERSITIES.includes(profile.university)) {
      setProfileUniversity(profile.university);
      setFormData(prev => ({ ...prev, university: profile.university }));
    }
  }, [profile]);

  const userRole = profile?.role ?? null;
  const checking = !profile && userRole === null;

  if (checking) {
    return (
      <div className="container animate-fade-in">
        <div className="page-loader"><div className="loader-spinner" /><p className="loader-text">Checking permissions...</p></div>
      </div>
    );
  }

  if (!CAN_SUBMIT_ROLES.includes(userRole)) {
    return (
      <div className="container animate-fade-in">
        <div className="empty-state" style={{ maxWidth: 560, margin: '48px auto' }}>
          <div className="empty-state-icon"><GraduationCap size={28} /></div>
          <h3>Event submission is for organizers only</h3>
          <p style={{ marginBottom: 24 }}>
            You need to be an approved organizer, advisor, or moderator to submit events.
            Students can browse and register for events.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/apply-organizer" style={{ textDecoration: 'none' }}>
              <Button variant="primary">Apply as Organizer</Button>
            </Link>
            <Link to="/events" style={{ textDecoration: 'none' }}>
              <Button variant="outline">Browse Events</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!isValidImageFile(file)) {
      setErrors(prev => ({ ...prev, poster: 'Please upload a valid image (JPEG, PNG, WebP)' }));
      setPosterFile(null);
      return;
    }
    if (!isFileSizeValid(file)) {
      setErrors(prev => ({ ...prev, poster: 'Image size must be less than 5MB' }));
      setPosterFile(null);
      return;
    }
    setPosterFile(file);
    setErrors(prev => ({ ...prev, poster: '' }));
  }

  const submittingRef = useRef(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;

    try {
      if (!user) {
        setMessage('You must be logged in to submit events');
        setMessageType('error');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      const validation = validateEventData(formData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }

      setSubmitting(true);
      setMessage('');

      // Wrap in a timeout so a hanging Supabase call surfaces as an error
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out — check your Supabase connection or RLS policies on the submissions table')), 12000)
      );

      const result = await Promise.race([
        submitEvent({ ...formData, dateTime: new Date(formData.dateTime) }, posterFile),
        timeoutPromise,
      ]);

      if (!mountedRef.current) return;

      if (result.success) {
        setMessage('Event submitted successfully! Awaiting moderator approval.');
        setMessageType('success');
        setFormData(prev => ({ ...EMPTY_FORM, university: prev.university }));
        setPosterFile(null);
        setTimeout(() => navigate('/my-events'), 2000);
      } else {
        setMessage(result.error || 'Submission failed — unknown error');
        setMessageType('error');
      }
    } catch (err) {
      console.error('Submit error:', err);
      if (mountedRef.current) {
        setMessage(err.message || 'Something went wrong');
        setMessageType('error');
      }
    } finally {
      submittingRef.current = false;
      if (mountedRef.current) setSubmitting(false);
    }
  }

  return (
    <div className="container animate-fade-in">
      <div className="form-container brutal-border">
        <div className="form-tape" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
          <ShieldCheck size={28} />
          <h1 style={{ fontSize: '2.5rem', textTransform: 'uppercase' }}>Drop an Event</h1>
        </div>

        {message && (
          <div style={{
            padding: '1rem',
            background: messageType === 'error' ? 'var(--pink)' : 'var(--cyan)',
            border: '3px solid black',
            marginBottom: '1rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            {messageType === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input label="Event Title" name="title" placeholder="e.g. Hackathon 2026" value={formData.title} onChange={handleChange} required />
          {errors.title && <div style={{ color: 'var(--pink)', fontWeight: 700, marginTop: '-1rem', marginBottom: '1rem' }}>{errors.title}</div>}

          <Input label="Description" name="description" type="textarea" placeholder="What's going down?" value={formData.description} onChange={handleChange} required />
          {errors.description && <div style={{ color: 'var(--pink)', fontWeight: 700, marginTop: '-1rem', marginBottom: '1rem' }}>{errors.description}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <Input label="Date & Time" name="dateTime" type="datetime-local" value={formData.dateTime} onChange={handleChange} required />
              {errors.dateTime && <div style={{ color: 'var(--pink)', fontWeight: 700, fontSize: '0.9rem' }}>{errors.dateTime}</div>}
            </div>
            <div>
              <Input label="University" name="university" type="select" options={['', ...EVENT_UNIVERSITIES]} value={formData.university} onChange={handleChange} required disabled={!!profileUniversity} />
              {profileUniversity && (
                <small style={{ display: 'block', marginTop: '-0.75rem', marginBottom: '1rem', color: 'var(--gray-400)', fontWeight: 600 }}>
                  University auto-set from your profile
                </small>
              )}
              {errors.university && <div style={{ color: 'var(--pink)', fontWeight: 700, fontSize: '0.9rem' }}>{errors.university}</div>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <Input label="Category" name="category" type="select" options={['', ...CATEGORIES]} value={formData.category} onChange={handleChange} required />
              {errors.category && <div style={{ color: 'var(--pink)', fontWeight: 700, fontSize: '0.9rem' }}>{errors.category}</div>}
            </div>
            <div>
              <Input label="Venue (Optional)" name="venue" placeholder="Main Auditorium" value={formData.venue} onChange={handleChange} />
            </div>
          </div>

          <Input label="Event Website URL (Optional)" name="eventURL" type="url" placeholder="https://yourEvent.com" value={formData.eventURL} onChange={handleChange} />

          <div className="input-group">
            <label>Event Poster *</label>
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} id="poster-upload" />
            <label htmlFor="poster-upload" className="brutal-border brutal-hover" style={{ padding: '2rem', textAlign: 'center', background: posterFile ? 'var(--cyan)' : 'var(--gray-100)', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
              {posterFile ? <><CheckCircle size={18} /> {posterFile.name}</> : <><Upload size={18} /> Upload Poster</>}
            </label>
            {errors.poster && <div style={{ color: 'var(--pink)', fontWeight: 700, marginTop: '0.5rem' }}>{errors.poster}</div>}
            <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginTop: '0.5rem' }}>Max 5MB. Supported: JPEG, PNG, WebP</div>
          </div>

          <Button variant="secondary" type="submit" disabled={submitting} style={{ width: '100%', fontSize: '1.2rem', padding: '1rem' }}>
            {submitting ? 'Submitting...' : 'Submit for Review'}
          </Button>
        </form>
      </div>
    </div>
  );
}
