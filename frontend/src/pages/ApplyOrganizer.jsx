import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUp, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { submitOrganizerApplication } from '../services/applicationService';
import { UNIVERSITIES } from '../utils/constants';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

export default function ApplyOrganizer() {
  const [formData, setFormData] = useState({
    university: '',
    societyName: '',
    reason: '',
  });

  const [files, setFiles] = useState({
    idCard: null,
    societyProof: null,
    authorization: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleFileChange = (e, fileKey) => {
    const file = e.target.files[0];
    if (file) {
      // Basic type & size validations (max 5MB, PDF or images)
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setErrors({ ...errors, [fileKey]: 'Invalid format. Use PDF, JPEG, PNG, or WebP.' });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, [fileKey]: 'File size exceeds 5MB limit.' });
        return;
      }

      setFiles({ ...files, [fileKey]: file });
      setErrors({ ...errors, [fileKey]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const formErrors = {};
    if (!formData.university) formErrors.university = 'Please select your university.';
    if (!formData.societyName.trim()) formErrors.societyName = 'Society/Club name is required.';
    if (!formData.reason.trim()) formErrors.reason = 'Authorization reason is required.';
    if (!files.idCard) formErrors.idCard = 'University Student ID Card is required for verification.';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setMessage('');

    const result = await submitOrganizerApplication(formData, files);

    if (result.success) {
      setMessage('Application submitted! Redirecting to profile...');
      setMessageType('success');
      setTimeout(() => navigate('/profile'), 2000);
    } else {
      setMessage(result.error || 'Failed to submit application');
      setMessageType('error');
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in">
      <div className="form-container brutal-border" style={{ maxWidth: '650px', margin: '2rem auto' }}>
        <div className="form-tape"></div>

        <h1 style={{ 
          fontSize: '2.5rem', 
          textTransform: 'uppercase', 
          fontWeight: 900,
          marginBottom: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem'
        }}>
          <Sparkles size={28} /> Host Events
        </h1>
        <p style={{ color: 'var(--gray-600)', fontWeight: 700, marginBottom: '2rem' }}>
          Apply for event organizer status to manage and publish events for your society or university.
        </p>

        {message && (
          <div style={{
            padding: '1rem',
            background: messageType === 'error' ? 'var(--pink)' : 'var(--cyan)',
            border: '3px solid black',
            marginBottom: '1.5rem',
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
          {/* University Dropdown */}
          <Input
            label="Select University *"
            name="university"
            type="select"
            options={UNIVERSITIES}
            value={formData.university}
            onChange={handleChange}
            required
          />
          {errors.university && <div style={{ color: 'var(--pink)', fontWeight: 700, marginTop: '-1rem', marginBottom: '1rem' }}>{errors.university}</div>}

          {/* Society Name */}
          <Input
            label="Society / Club Name *"
            name="societyName"
            placeholder="e.g. Computer Science Society"
            value={formData.societyName}
            onChange={handleChange}
            required
          />
          {errors.societyName && <div style={{ color: 'var(--pink)', fontWeight: 700, marginTop: '-1rem', marginBottom: '1rem' }}>{errors.societyName}</div>}

          {/* Reason */}
          <Input
            label="Why do you want authorization? *"
            name="reason"
            type="textarea"
            placeholder="Briefly describe your role in the society and the events you plan to organize."
            value={formData.reason}
            onChange={handleChange}
            required
          />
          {errors.reason && <div style={{ color: 'var(--pink)', fontWeight: 700, marginTop: '-1rem', marginBottom: '1rem' }}>{errors.reason}</div>}

          {/* Verification Docs Section */}
          <div style={{
            background: 'var(--gray-100)',
            border: '3px solid black',
            padding: '1.5rem',
            marginBottom: '2rem',
            borderRadius: 0
          }}>
            <h3 style={{ textTransform: 'uppercase', fontWeight: 900, fontSize: '1.1rem', marginBottom: '1rem' }}>
              Verification Documents (Max 5MB each, PDF or Images)
            </h3>

            {/* Document 1: ID Card */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                1. Student ID Card *
              </label>
              <input
                type="file"
                accept="application/pdf, image/*"
                onChange={(e) => handleFileChange(e, 'idCard')}
                id="doc-idcard"
                style={{ display: 'none' }}
              />
              <label htmlFor="doc-idcard" className="brutal-border brutal-hover" style={{
                display: 'flex', alignItems: 'center', justifySelf: 'start', gap: '0.5rem',
                background: files.idCard ? 'var(--cyan)' : 'white',
                padding: '0.6rem 1rem', fontWeight: 700, cursor: 'pointer', borderSize: '2px'
              }}>
                <FileUp size={16} /> {files.idCard ? files.idCard.name : 'Choose File'}
              </label>
              {errors.idCard && <div style={{ color: 'var(--pink)', fontWeight: 700, fontSize: '0.85rem', marginTop: '0.3rem' }}>{errors.idCard}</div>}
            </div>

            {/* Document 2: Society Proof */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                2. Society Membership / Designation Proof (Optional)
              </label>
              <input
                type="file"
                accept="application/pdf, image/*"
                onChange={(e) => handleFileChange(e, 'societyProof')}
                id="doc-proof"
                style={{ display: 'none' }}
              />
              <label htmlFor="doc-proof" className="brutal-border brutal-hover" style={{
                display: 'flex', alignItems: 'center', justifySelf: 'start', gap: '0.5rem',
                background: files.societyProof ? 'var(--cyan)' : 'white',
                padding: '0.6rem 1rem', fontWeight: 700, cursor: 'pointer', borderSize: '2px'
              }}>
                <FileUp size={16} /> {files.societyProof ? files.societyProof.name : 'Choose File'}
              </label>
              {errors.societyProof && <div style={{ color: 'var(--pink)', fontWeight: 700, fontSize: '0.85rem', marginTop: '0.3rem' }}>{errors.societyProof}</div>}
            </div>

            {/* Document 3: Dept Authorization */}
            <div>
              <label style={{ display: 'block', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                3. Faculty Recommendation / Dept Authorization Letter (Optional)
              </label>
              <input
                type="file"
                accept="application/pdf, image/*"
                onChange={(e) => handleFileChange(e, 'authorization')}
                id="doc-auth"
                style={{ display: 'none' }}
              />
              <label htmlFor="doc-auth" className="brutal-border brutal-hover" style={{
                display: 'flex', alignItems: 'center', justifySelf: 'start', gap: '0.5rem',
                background: files.authorization ? 'var(--cyan)' : 'white',
                padding: '0.6rem 1rem', fontWeight: 700, cursor: 'pointer', borderSize: '2px'
              }}>
                <FileUp size={16} /> {files.authorization ? files.authorization.name : 'Choose File'}
              </label>
              {errors.authorization && <div style={{ color: 'var(--pink)', fontWeight: 700, fontSize: '0.85rem', marginTop: '0.3rem' }}>{errors.authorization}</div>}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            style={{ width: '100%', fontSize: '1.2rem', padding: '1rem', border: '3px solid black' }}
          >
            {loading ? 'Uploading & Submitting...' : 'Submit Application'}
          </Button>
        </form>
      </div>
    </div>
  );
}
