import React from 'react';
import { getCategoryBadgeClass } from '../../utils/constants';

export default function Badge({ children, color, category, className = '', style = {} }) {
  const badgeClass = category ? getCategoryBadgeClass(category) : '';
  const combinedStyle = color ? { backgroundColor: color, ...style } : style;

  return (
    <span
      className={`badge ${badgeClass} ${className}`.trim()}
      style={Object.keys(combinedStyle).length ? combinedStyle : undefined}
    >
      {children}
    </span>
  );
}
