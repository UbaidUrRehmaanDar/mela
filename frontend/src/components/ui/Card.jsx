import React from 'react';

export default function Card({ children, className = '' }) {
  return (
    <div className={`event-card brutal-border brutal-hover ${className}`}>
      {children}
    </div>
  );
}