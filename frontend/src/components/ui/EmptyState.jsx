import React from 'react';
import { CalendarX } from 'lucide-react';

export default function EmptyState({
  icon: Icon = CalendarX,
  title = 'Nothing here',
  description = 'No items to display.',
  action,
}) {
  return (
    <div className="empty-state animate-fade-in">
      <div className="empty-state-icon">
        <Icon size={24} aria-hidden="true" />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  );
}
