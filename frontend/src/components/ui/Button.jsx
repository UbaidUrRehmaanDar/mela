import React from 'react';

const variants = { primary: 'primary', secondary: 'secondary', outline: 'outline', danger: 'danger', success: 'success' };
const sizes = { sm: 'sm', lg: 'lg' };

export default function Button({ variant = 'primary', size, className = '', children, ...props }) {
  const variantClass = variants[variant] || 'primary';
  const sizeClass = size === 'sm' || size === 'lg' ? size : '';
  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}

export function IconButton({ active = false, wishlist = false, className = '', children, ...props }) {
  return (
    <button
      className={`btn-icon ${active ? 'active' : ''} ${wishlist ? 'wishlist-active' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}
