import React from 'react';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <main id="main-content" className="app-main" role="main">
        {children}
      </main>
      <Footer />
    </div>
  );
}
