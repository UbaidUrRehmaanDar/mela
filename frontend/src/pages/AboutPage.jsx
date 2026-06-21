import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Heart, Zap, Shield } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';

const values = [
  {
    icon: Target,
    title: 'Centralized',
    desc: 'One platform instead of dozens of scattered group chats, posters, and social media posts.',
  },
  {
    icon: Heart,
    title: 'Student-first',
    desc: 'Built for students who want to discover opportunities without the noise.',
  },
  {
    icon: Zap,
    title: 'Fast & Simple',
    desc: 'Find, save, and register for events in seconds. No clutter, no confusion.',
  },
  {
    icon: Shield,
    title: 'Moderated',
    desc: 'Every submitted event goes through review so you see quality, verified listings.',
  },
];

export default function AboutPage() {
  return (
    <div className="container animate-fade-in">
      <PageHeader
        title="About MELA"
        subtitle="We're building the missing layer between campus organizers and students who want to show up."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'About' }]}
      />

      <div className="profile-card" style={{ marginBottom: '40px' }}>
        <h2 className="text-subsection" style={{ marginBottom: '16px' }}>Our Mission</h2>
        <p className="font-body" style={{ color: 'var(--gray-600)', marginBottom: '16px' }}>
          Pakistani universities are buzzing with hackathons, workshops, seminars, and meetups —
          but finding them is harder than it should be. MELA brings every campus event into one
          searchable, saveable, registerable feed.
        </p>
        <p className="font-body" style={{ color: 'var(--gray-600)' }}>
          Whether you're a student looking for your next hackathon or a society president
          trying to reach your audience, MELA is the bridge.
        </p>
      </div>

      <h2 className="section-heading" style={{ fontSize: '1.75rem' }}>What we stand for</h2>
      <div className="feature-grid" style={{ marginBottom: '40px' }}>
        {values.map((v) => (
          <div key={v.title} className="feature-card">
            <div className="feature-card-icon">
              <v.icon size={22} strokeWidth={2.5} aria-hidden="true" />
            </div>
            <h3>{v.title}</h3>
            <p>{v.desc}</p>
          </div>
        ))}
      </div>

      <div className="cta-banner">
        <h2>Want to get involved?</h2>
        <p>Start exploring events or submit your own to reach students across campuses.</p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/events" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="lg">Explore Events</Button>
          </Link>
          <Link to="/help" style={{ textDecoration: 'none' }}>
            <Button variant="outline" size="lg" style={{ background: 'var(--white)' }}>Get Help</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
