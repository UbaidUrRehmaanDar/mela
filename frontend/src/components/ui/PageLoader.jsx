import React from 'react';

export default function PageLoader({ message = 'Loading', inline = false, fullPage = false }) {
  return (
    <div
      className={`page-loader ${inline ? 'page-loader-inline' : ''}`}
      style={fullPage ? { minHeight: '50vh' } : undefined}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="loader-spinner" aria-hidden="true" />
      <p className="loader-text">{message}</p>
    </div>
  );
}
