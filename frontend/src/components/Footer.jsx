import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <span className="logo-text">MELA</span>
            <p>Your centralized campus event discovery platform. Never miss an opportunity at your university.</p>
          </div>
          <div className="footer-col">
            <h4>Explore</h4>
            <Link to="/events">Events</Link>
            <Link to="/universities">Campuses</Link>
            <Link to="/about">About</Link>
          </div>
          <div className="footer-col">
            <h4>Community</h4>
            <Link to="/submit">Submit Event</Link>
            <Link to="/apply-organizer">Become Organizer</Link>
            <Link to="/help">Help</Link>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} MELA</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            Made with <Heart size={12} fill="#FF6B6B" color="#FF6B6B" /> for students
          </span>
        </div>
      </div>
    </footer>
  );
}
