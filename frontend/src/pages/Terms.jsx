import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import { FileText } from 'lucide-react';

export default function Terms() {
  return (
    <div className="container animate-fade-in">
      <PageHeader
        title="Terms of Service"
        subtitle="Rules and guidelines for using MELA"
        icon={FileText}
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Terms' }]}
      />

      <div className="brutal-border" style={{ background: 'white', padding: '2rem', maxWidth: '720px', margin: '0 auto' }}>
        <Section title="Acceptance of Terms">
          By using MELA, you agree to these Terms of Service. If you do not agree, please do not
          use the platform.
        </Section>

        <Section title="User Accounts">
          You are responsible for maintaining the confidentiality of your account credentials.
          You must provide accurate information during registration.
        </Section>

        <Section title="Event Submissions">
          Event organizers agree that submitted events will be reviewed by campus moderators.
          MELA reserves the right to reject or remove events that violate community guidelines.
        </Section>

        <Section title="Code of Conduct">
          Users agree to: (a) treat others with respect, (b) not post harmful or misleading content,
          (c) not attempt to breach platform security, and (d) comply with all applicable laws.
        </Section>

        <Section title="Limitation of Liability">
          MELA is provided "as is" without warranties. We are not responsible for event cancellations,
          changes, or any disputes between event organizers and attendees.
        </Section>

        <Section title="Changes to Terms">
          We reserve the right to update these terms. Users will be notified of material changes
          via email or platform notice.
        </Section>

        <p style={{ marginTop: '2rem', fontSize: '0.85rem', color: 'var(--gray-500)', fontWeight: 700 }}>
          Last updated: June 2026
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h2 style={{ fontSize: '1.3rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.5rem', borderBottom: '2px solid black', paddingBottom: '0.3rem' }}>
        {title}
      </h2>
      <p style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.6 }}>{children}</p>
    </div>
  );
}
