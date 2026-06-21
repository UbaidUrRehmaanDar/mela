import React, { useState } from 'react';
import { Mail, MessageSquare, Send, AlertCircle, CheckCircle } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError('All fields are required');
      return;
    }
    if (!form.email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    // In production this would send to a backend endpoint
    // For now, show success
    setSent(true);
  };

  if (sent) {
    return (
      <div className="container animate-fade-in">
        <div className="form-container" style={{ textAlign: 'center', padding: '3rem 0' }}>
          <CheckCircle size={48} style={{ color: 'var(--green)', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Message Sent
          </h1>
          <p style={{ fontWeight: 700, marginBottom: '0.5rem' }}>
            Thank you for reaching out! We'll get back to you as soon as possible.
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--gray-500)', fontWeight: 700 }}>
            In the meantime, check out our <a href="/help" style={{ fontWeight: 900 }}>Help page</a> for FAQs.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in">
      <PageHeader
        title="Contact Us"
        subtitle="Have a question or feedback? We'd love to hear from you."
        icon={MessageSquare}
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
      />

      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <div className="brutal-border" style={{ background: 'white', padding: '2rem' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <ContactCard icon={Mail} label="Email" value="hello@mela.pk" />
          </div>

          {error && (
            <div className="alert error" role="alert">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <Input label="Your Name" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required />
            <Input label="Your Email" name="email" type="email" placeholder="you@university.edu.pk" value={form.email} onChange={handleChange} required />
            <div className="input-group">
              <label>Message</label>
              <textarea
                name="message"
                placeholder="Tell us how we can help..."
                value={form.message}
                onChange={handleChange}
                required
                style={{
                  padding: '0.8rem', fontFamily: 'inherit', fontWeight: 700,
                  border: '3px solid black', minHeight: '140px', width: '100%',
                  boxSizing: 'border-box', fontSize: '1rem'
                }}
              />
            </div>
            <Button variant="primary" type="submit" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
              <Send size={16} /> Send Message
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ContactCard({ icon: Icon, label, value }) {
  return (
    <div className="brutal-border" style={{
      background: 'var(--yellow)', padding: '1rem 1.5rem', display: 'flex',
      alignItems: 'center', gap: '0.75rem', minWidth: '200px'
    }}>
      <div style={{ background: 'white', border: '2px solid black', padding: '0.5rem', display: 'flex' }}>
        <Icon size={20} />
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>{label}</div>
        <div style={{ fontWeight: 900 }}>{value}</div>
      </div>
    </div>
  );
}
