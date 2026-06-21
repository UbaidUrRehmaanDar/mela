import React from 'react';
import PageHeader from '../components/ui/PageHeader';
import { Shield } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="container animate-fade-in">
      <PageHeader
        title="Privacy Policy"
        subtitle="How MELA handles your data"
        icon={Shield}
        breadcrumb={[{ label: 'Home', to: '/' }, { label: 'Privacy' }]}
      />

      <div className="brutal-border" style={{ background: 'white', padding: '2rem', maxWidth: '720px', margin: '0 auto' }}>
        <Section title="Information We Collect">
          MELA collects the minimum information needed to provide our campus event discovery platform:
          your name, university email, and university affiliation. We also collect event registration
          data when you sign up for events.
        </Section>

        <Section title="How We Use Your Information">
          Your information is used solely to facilitate event discovery, registration, and
          organizer verification. We do not sell, share, or rent your personal data to third parties.
        </Section>

        <Section title="Data Storage & Security">
          All data is stored securely using industry-standard encryption. Your password is never
          stored in plain text. We use Supabase, a SOC 2 compliant backend, for data infrastructure.
        </Section>

        <Section title="Your Rights">
          You may request access to, correction of, or deletion of your personal data at any time
          by contacting us. You can delete your account through the profile settings page.
        </Section>

        <Section title="Cookies">
          MELA uses essential authentication cookies to maintain your session. No tracking
          or advertising cookies are used.
        </Section>

        <Section title="Contact">
          For privacy-related inquiries, please contact us through the Contact page.
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
