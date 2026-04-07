import React from 'react';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  return (
    <button 
      className={`btn ${variant} brutal-border brutal-hover ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
}