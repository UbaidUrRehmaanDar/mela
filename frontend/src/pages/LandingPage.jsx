import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Search,
  Bookmark,
  Users,
  Sparkles,
  ArrowRight,
  MapPin,
  TrendingUp,
  Star,
} from 'lucide-react';
import Button from '../components/ui/Button';
import { INTEREST_CATEGORIES } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    icon: Search,
    title: 'Smart Discovery',
    desc: 'Search and filter events by campus, category, and date. Find what matters to you instantly.',
  },
  {
    icon: Bookmark,
    title: 'Save & Track',
    desc: 'Build your personal wishlist. Never lose track of hackathons, workshops, or meetups again.',
  },
  {
    icon: Sparkles,
    title: 'Personalized Picks',
    desc: 'Set your interests and get recommendations tailored to your campus and passions.',
  },
  {
    icon: Users,
    title: 'For Organizers',
    desc: 'Submit events, manage registrations, and reach students across universities.',
  },
];

const steps = [
  { title: 'Browse Events', desc: 'Explore the feed or search by campus and category.' },
  { title: 'Save Favorites', desc: 'Bookmark events you want to attend later.' },
  { title: 'Register', desc: 'Sign up directly from the event page in one click.' },
  { title: 'Stay Updated', desc: 'Get reminders and never miss what you saved.' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate('/events', { replace: true });
    }
  }, [user, loading, navigate]);

  return (
    <>
      <section className="hero">
        <h1 className="text-hero animate-slide-up">
          Discover Your<br />
          <span className="highlight">Next Opportunity</span>
        </h1>

        <p className="animate-slide-up animate-delay-1">
          Connect with events across universities &mdash; hackathons, workshops, seminars,
          and meetups happening at campuses across Pakistan.
        </p>

        <div className="hero-actions animate-slide-up animate-delay-2">
          <Link to="/events" style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="lg">
              Explore Events <ArrowRight size={18} aria-hidden="true" />
            </Button>
          </Link>
          <Link to="/universities" style={{ textDecoration: 'none' }}>
            <Button variant="outline" size="lg">Browse Campuses</Button>
          </Link>
        </div>

        <div className="hero-stats animate-slide-up animate-delay-3">
          <div className="hero-stat">
            <strong>8+</strong>
            <span>Universities</span>
          </div>
          <div className="hero-stat">
            <strong>7</strong>
            <span>Event Types</span>
          </div>
          <div className="hero-stat">
            <strong>Free</strong>
            <span>For Students</span>
          </div>
          <div className="hero-stat">
            <strong>1K+</strong>
            <span>Events Posted</span>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2 className="section-heading animate-fade-in">Everything you need</h2>
          <p className="page-subtitle" style={{ marginBottom: '2rem' }}>
            One place to discover campus life &mdash; no more scattered WhatsApp groups or missed posters.
          </p>

          <div className="feature-grid">
            {features.map((f, i) => (
              <div key={f.title} className="feature-card animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="feature-card-icon">
                  <f.icon size={22} strokeWidth={2.5} aria-hidden="true" />
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-heading">Browse by Interest</h2>
          <div className="category-pills" style={{ marginBottom: '2rem' }}>
            {INTEREST_CATEGORIES.map((cat, i) => (
              <Link
                key={cat.label}
                to={`/events?category=${encodeURIComponent(cat.label)}`}
                className="btn-pill animate-fade-in"
                style={{ background: cat.color, textDecoration: 'none', color: '#000', animationDelay: `${i * 50}ms` }}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <h2 className="section-heading">How it works</h2>
          <div className="steps-row">
            {steps.map((step, i) => (
              <div key={step.title} className="step-card animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="cta-banner animate-pop">
            <CalendarDays size={36} style={{ margin: '0 auto 16px', color: 'var(--yellow)' }} aria-hidden="true" />
            <h2>Ready to dive in?</h2>
            <p>
              Join students discovering events on their campus. Organizers can submit events for review in minutes.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/events" style={{ textDecoration: 'none' }}>
                <Button variant="primary" size="lg">Browse Events</Button>
              </Link>
              <Link to="/submit" style={{ textDecoration: 'none' }}>
                <Button variant="outline" size="lg" style={{ background: 'var(--white)' }}>
                  Submit an Event
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
