import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, ThumbsUp, MessageSquare, Users } from 'lucide-react';
import { formatEventDate, CATEGORY_COLORS } from '../../utils/constants';
import Card from './Card';
import Badge from './Badge';
import Button from './Button';

function normalizeEvent(event) {
  return {
    id: event.id || event.eventId,
    title: event.title || event.eventTitle,
    university: event.university,
    category: event.category || 'Event',
    dateTime: event.dateTime || event.eventDateTime,
    posterURL: event.posterURL || event.poster_url,
    description: event.description,
  };
}

export default function EventCard({
  event,
  variant = 'default',
  extraBadges,
  footer,
  stats,
  showRegister = false,
}) {
  const e = normalizeEvent(event);
  const fallbackColor = CATEGORY_COLORS[e.category] || 'var(--yellow)';

  return (
    <Card className={`event-card--poster${variant === 'recommended' ? ' event-card--recommended' : ''}`}>
      <Link to={`/events/${e.id}`} className="event-card-poster-link" tabIndex={-1} aria-hidden="true">
        <div className="event-card-poster">
          {e.posterURL ? (
            <img src={e.posterURL} alt={`Event poster for ${e.title}`} loading="lazy" />
          ) : (
            <div className="event-card-poster-fallback" style={{ background: fallbackColor }}>
              <span>{e.category}</span>
            </div>
          )}
        </div>
      </Link>

      <div className="event-card-body">
        <div className="event-card-badges">
          <Badge category={e.category}>{e.category}</Badge>
          {extraBadges}
        </div>

        <Link to={`/events/${e.id}`} className="event-card-title-link">
          <h2>{e.title}</h2>
        </Link>

        {e.university && <span className="uni">{e.university}</span>}

        <p className="date">
          <CalendarDays size={14} aria-hidden="true" />
          {formatEventDate(e.dateTime)}
        </p>

        {e.description && (
          <p className="font-body" style={{ fontSize: '0.9375rem', color: 'var(--gray-600)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {e.description}
          </p>
        )}

        {stats && (
          <div className="event-card-stats">
            <span><ThumbsUp size={13} aria-hidden="true" /> {stats.likes}</span>
            <span><MessageSquare size={13} aria-hidden="true" /> {stats.comments}</span>
            <span><Users size={13} aria-hidden="true" /> {stats.registrations} registered</span>
          </div>
        )}

        {footer || (
          <Link to={`/events/${e.id}`} style={{ marginTop: 'auto' }}>
            <Button variant="primary" size="sm" style={{ width: '100%', minWidth: 0 }}>
              View Details
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
}
