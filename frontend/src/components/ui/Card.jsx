import React from 'react';

export default function Card({ children, className = '', style = {} }) {
  return (
    <div className={`event-card ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}
