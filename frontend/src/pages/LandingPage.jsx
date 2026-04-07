import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function LandingPage() {
  return (
    <div className="hero">
      <h1>
        Discover <br />
        <span>Campus Events</span>
      </h1>
      <p>
        The chaotic, colorful, and centralized hub for every hackathon, workshop, and meetup happening at your university.
      </p>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <Link to="/events">
          <Button variant="primary" style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}>Explore Events</Button>
        </Link>
        <Link to="/submit">
          <Button variant="outline" style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}>Submit Event</Button>
        </Link>
      </div>
    </div>
  );
}