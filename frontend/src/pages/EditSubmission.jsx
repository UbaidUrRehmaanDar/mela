import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { getSubmissionById, updateSubmission } from '../services';
import { useAuth } from '../context/AuthContext';
import { validateEventData, isValidImageFile, isFileSizeValid, EVENT_UNIVERSITIES, CATEGORIES } from '../utils/constants';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import PageHeader from '../components/ui/PageHeader';
import { SkeletonList } from '../components/ui/Skeleton';

function toDatetimeLocal(dateVal) {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  const offset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - offset).toISOString().slice(0, 16);
}

const EMPTY_FORM = { title: '', description: '', dateTime: '', university: '', category: '', venue: '', eventURL: '' };

export default function EditSubmission() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const mountedRef = useRef(true);

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [existingPosterURL, setExistingPosterURL] = useState('');
  const [posterFile, setPosterFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;

    if (authLoading) return;
    if (!user) { navigate('/login'); return; }

    async function fetchSubmission() {
      try {
        const result = await getSubmissionById(id);
        if (cancelled || !mountedRef.current) return;

        if (!result.success || !result.submission) {
          setMessage(result.error || 'Submission not found');
          setMessageType('error');
          return;
        }

        const sub = result.submission;

        if (sub.organizer_id !== user.id) {
          setMessage('You are not authorized to edit this submission.');
          setMessageType('error');
          return;
        }

        if (sub.status !== 'pending') {
          setMessage(`This submission has already been ${sub.status} and cannot be edited.`);
          setMessageType('error');
          return;
        }

        setFormData({
          title: sub.title || '',
          description: sub.description || '',
          dateTime: toDatetimeLocal(sub.dateTime),
          university: sub.university || '',
          category: sub.category || '',
          venue: sub.venue || '',
          eventURL: sub.event_url || '',
        });
        setExistingPosterURL(sub.poster_url || '');
      } catch (err) {
        if (!cancelled && mountedRef.current) {
          setMessage(err.message || 'Failed to load submission');
          setMessageType('error');
        }
      } finally {
        if (!cancelled && mountedRef.current) setLoading(false);
      }
    }

    fetchSubmission();
    return () => { cancelled = true; mountedRef.current = false; };
  }, [id, navigate, user, authLoading]);

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

  async function handleSubmit(e) {
    e.preventDefault();

    const validation = validateEventData(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const result = await updateSubmission(id, { ...formData, dateTime: new Date(formData.dateTime) }, posterFile);

      if (!mountedRef.current) return;

      if (result.success) {
        setMessage('Submission updated successfully');
        setMessageType('success');
        setTimeout(() => navigate('/my-submissions'), 2000);
      } else {
        setMessage(result.error);
        setMessageType('error');
      }
    } catch (err) {
      if (mountedRef.current) {
        setMessage(err.message);
        setMessageType('error');
      }
    } finally {
      if (mountedRef.current) setSaving(false);
    }
  }

  const hasFatalError = messageType === 'error' && !saving && !loading;

  return (
    <div className="container animate-fade-in">
      <PageHeader
        title="Edit Submission"
        subtitle={loading ? 'Loading submission...' : 'Update your pending event details.'}
      />

      {loading ? (
        <SkeletonList count={2} />
      ) : (
        <div className="form-container brutal-border" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div className="form-tape" />

          {message && (
            <div className={`alert ${messageType === 'error' ? 'error' : 'success'}`}>
              {messageType === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
              {message}
            </div>
          )}

          {!hasFatalError && (
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
                  <Input label="University" name="university" type="select" options={['', ...EVENT_UNIVERSITIES]} value={formData.university} onChange={handleChange} required />
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
                <label>Event Poster</label>

                {existingPosterURL && !posterFile && (
                  <div style={{ marginBottom: '1rem', border: '3px solid black', padding: '0.5rem', background: 'var(--white)', display: 'inline-block' }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Current Poster:</p>
                    <img src={existingPosterURL} alt="Current Poster" style={{ maxHeight: '150px', border: '2px solid black', display: 'block' }} />
                  </div>
                )}

                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} id="poster-upload" />
                <label htmlFor="poster-upload" className="brutal-border brutal-hover" style={{ padding: '1.5rem', textAlign: 'center', background: posterFile ? 'var(--cyan)' : 'var(--yellow)', cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
                  {posterFile ? <><CheckCircle size={18} /> {posterFile.name}</> : <><RefreshCw size={18} /> Change Poster (Optional)</>}
                </label>
                {errors.poster && <div style={{ color: 'var(--pink)', fontWeight: 700, marginTop: '0.5rem' }}>{errors.poster}</div>}
                <div style={{ fontSize: '0.85rem', color: 'var(--gray-600)', marginTop: '0.5rem' }}>Leave empty to keep existing poster. Max 5MB. JPEG, PNG, WebP.</div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <Button variant="primary" type="submit" disabled={saving} style={{ flex: 2, fontSize: '1.2rem', padding: '1rem' }}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="outline" type="button" onClick={() => navigate('/my-submissions')} style={{ flex: 1, fontSize: '1.2rem', padding: '1rem' }}>
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
