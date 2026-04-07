import React from 'react';

export default function Badge({ children, color = 'var(--mela-teal)' }) {
  return (
    <span 
      className="badge" 
      style={{ backgroundColor: color }}
    >
      {children}
    </span>
  );
}