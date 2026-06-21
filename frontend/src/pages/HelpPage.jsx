import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Button from '../components/ui/Button';

const faqs = [
  {
    q: 'How do I find events at my university?',
    a: 'Go to Events and use the university filter, or browse the Campuses page to see all events at a specific institution. You can also set your university in your profile for personalized recommendations.',
  },
  {
    q: 'How do I submit an event?',
    a: 'Sign in, then go to Submit Event. Fill in the details, upload a poster, and submit. A moderator will review your submission before it goes live on the feed.',
  },
  {
    q: 'What does "Saved" mean?',
    a: 'Saved events are your personal wishlist. Click the bookmark icon on any event to save it. Access all saved events from the Saved link in the navigation bar.',
  },
  {
    q: 'How do I register for an event?',
    a: 'Open the event details page and click Register. You must be signed in. Organizers can view registrations from their My Submissions dashboard.',
  },
  {
    q: 'How do I become a verified organizer?',
    a: 'Go to your Profile and apply to become an organizer. Upload the required documents. Once approved by an admin, you get verified organizer status.',
  },
  {
    q: 'Why was my event submission rejected?',
    a: 'Check My Submissions for the rejection reason. You can edit and resubmit rejected events. Common issues include incomplete details or inappropriate content.',
  },
  {
    q: 'Is Mela free to use?',
    a: 'Yes. Mela is free for students to browse, save, and register for events. Organizers can submit events at no cost.',
  },
];

function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="faq-item">
      <button
        className={`faq-question ${open ? 'open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {question}
        <ChevronDown
          size={18}
          style={{
            flexShrink: 0,
            transform: open ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.2s ease',
          }}
        />
      </button>
      {open && <div className="faq-answer">{answer}</div>}
    </div>
  );
}

export default function HelpPage() {
  return (
    <div className="container container-narrow animate-fade-in">
      <PageHeader
        title="Help & FAQ"
        subtitle="Quick answers to common questions about using MELA."
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Help' }]}
      />

      <div className="faq-list" style={{ marginBottom: '2.5rem' }}>
        {faqs.map((faq) => (
          <FaqItem key={faq.q} question={faq.q} answer={faq.a} />
        ))}
      </div>

      <div className="info-banner" style={{ textAlign: 'center', background: 'var(--yellow)', marginBottom: 0 }}>
        <h3 className="font-ui" style={{ fontWeight: 700, marginBottom: '8px' }}>
          Still need help?
        </h3>
        <p className="font-body" style={{ fontSize: '0.9375rem', color: 'var(--gray-600)', marginBottom: '16px' }}>
          Check your profile settings or reach out to your campus moderator.
        </p>
        <Link to="/profile" style={{ textDecoration: 'none' }}>
          <Button variant="outline">Go to Profile</Button>
        </Link>
      </div>
    </div>
  );
}
