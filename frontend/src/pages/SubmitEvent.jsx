import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitEvent } from '../services';
import { getCurrentUser } from '../services';
import { Timestamp } from 'firebase/firestore';
import { validateEventData, isValidImageFile, isFileSizeValid } from '../utils/constants';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function SubmitEvent() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dateTime: '',
    university: '',
    category: '',
    venue: ''
  });
  const [posterFile, setPosterFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!isValidImageFile(file)) {
        setErrors({ ...errors, poster: 'Please upload a valid image (JPEG, PNG, WebP)' });
        setPosterFile(null);
        return;
      }
      if (!isFileSizeValid(file)) {
        setErrors({ ...errors, poster: 'Image size must be less than 5MB' });
        setPosterFile(null);
        return;
      }
      setPosterFile(file);
      setErrors({ ...errors, poster: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check authentication
    const user = getCurrentUser();
    if (!user) {
      setMessage('You must be logged in to submit events');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    // Validate form data
    const validation = validateEventData(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (!posterFile) {
      setErrors({ ...errors, poster: 'Event poster is required' });
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // Convert datetime to Firestore Timestamp
      const eventData = {
        ...formData,
        dateTime: Timestamp.fromDate(new Date(formData.dateTime))
      };

      const result = await submitEvent(eventData, posterFile);

      if (result.success) {
        setMessage('✓ Event submitted successfully! Awaiting moderator approval.');
        // Reset form
        setFormData({
          title: '',
          description: '',
          dateTime: '',
          university: '',
          category: '',
          venue: ''
        });
        setPosterFile(null);
        
        // Redirect after 2 seconds
        setTimeout(() => navigate('/my-submissions'), 2000);
      } else {
        setMessage(`Error: ${result.error}`);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="form-container brutal-border">
        <div className="form-tape"></div>
        <h1 style={{ fontSize: '2.5rem', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Drop an Event</h1>
        
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

        <form onSubmit={handleSubmit}>
          <Input 
            label="Event Title" 
            name="title"
            placeholder="e.g. Hackathon 2026" 
            value={formData.title}
            onChange={handleChange}
            required
          />
          {errors.title && <div style={{ color: 'var(--mela-pink)', fontWeight: 700, marginTop: '-1rem', marginBottom: '1rem' }}>{errors.title}</div>}
          
          <Input 
            label="Description" 
            name="description"
            type="textarea" 
            placeholder="What's going down?" 
            value={formData.description}
            onChange={handleChange}
            required
          />
          {errors.description && <div style={{ color: 'var(--mela-pink)', fontWeight: 700, marginTop: '-1rem', marginBottom: '1rem' }}>{errors.description}</div>}
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <Input 
                label="Date & Time" 
                name="dateTime"
                type="datetime-local" 
                value={formData.dateTime}
                onChange={handleChange}
                required
              />
              {errors.dateTime && <div style={{ color: 'var(--mela-pink)', fontWeight: 700, fontSize: '0.9rem' }}>{errors.dateTime}</div>}
            </div>
            
            <div>
              <Input 
                label="University" 
                name="university"
                type="select" 
                options={['', 'FAST NUCES', 'LUMS', 'PUCIT', 'UET', 'Punjab University', 'NUST', 'COMSATS', 'Other']}
                value={formData.university}
                onChange={handleChange}
                required
              />
              {errors.university && <div style={{ color: 'var(--mela-pink)', fontWeight: 700, fontSize: '0.9rem' }}>{errors.university}</div>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <Input 
                label="Category" 
                name="category"
                type="select" 
                options={['', 'Tech', 'Workshop', 'Seminar', 'Hackathon', 'Meetup', 'Conference', 'Competition', 'Other']}
                value={formData.category}
                onChange={handleChange}
                required
              />
              {errors.category && <div style={{ color: 'var(--mela-pink)', fontWeight: 700, fontSize: '0.9rem' }}>{errors.category}</div>}
            </div>
            
            <div>
              <Input 
                label="Venue (Optional)" 
                name="venue"
                placeholder="Main Auditorium" 
                value={formData.venue}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="input-group">
            <label>Event Poster *</label>
            <input 
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="poster-upload"
            />
            <label 
              htmlFor="poster-upload"
              className="brutal-border brutal-hover" 
              style={{ 
                padding: '2rem', 
                textAlign: 'center', 
                background: posterFile ? 'var(--mela-teal)' : '#e0e0e0', 
                cursor: 'pointer', 
                fontWeight: 700,
                display: 'block'
              }}
            >
              {posterFile ? `✓ ${posterFile.name}` : '+ UPLOAD AWESOME POSTER'}
            </label>
            {errors.poster && <div style={{ color: 'var(--mela-pink)', fontWeight: 700, marginTop: '0.5rem' }}>{errors.poster}</div>}
            <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>
              Max 5MB. Supported: JPEG, PNG, WebP
            </div>
          </div>

          <Button 
            variant="secondary" 
            type="submit"
            disabled={loading}
            style={{ width: '100%', fontSize: '1.2rem', padding: '1rem' }}
          >
            {loading ? 'Submitting...' : 'Submit for Review'}
          </Button>
        </form>
      </div>
    </div>
  );
}
