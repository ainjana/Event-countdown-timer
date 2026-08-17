import React from 'react';
import { Link } from 'react-router-dom';
import { Countdown } from './Countdown';
import { formatDate } from '../utils/countdownUtils';
import { Edit3, Trash2, Calendar } from 'lucide-react';

export const EventCard = ({ event, onDeleteClick }) => {
  const getBadgeClass = (category) => {
    switch (category?.toLowerCase()) {
      case 'trip': return 'badge-trip';
      case 'birthday': return 'badge-birthday';
      case 'launch': return 'badge-launch';
      case 'wedding': return 'badge-wedding';
      case 'exam': return 'badge-exam';
      case 'anniversary': return 'badge-anniversary';
      default: return 'badge-other';
    }
  };

  return (
    <div className="event-card">
      <div>
        <div className="event-card-header">
          <span className={`badge ${getBadgeClass(event.category)}`}>
            {event.category || 'Other'}
          </span>
          <div style={{ fontSize: '0.8rem', color: '#888', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Calendar size={13} />
            <span>{formatDate(event.target_date)}</span>
          </div>
        </div>

        <h3 className="event-card-title">{event.title}</h3>
        {event.description && <p className="event-card-desc">{event.description}</p>}

        <Countdown targetDate={event.target_date} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #EAE8E2' }}>
        <Link to={`/events/${event.id}/edit`} className="btn btn-secondary btn-sm">
          <Edit3 size={14} />
          <span>Edit</span>
        </Link>
        <button onClick={() => onDeleteClick(event)} className="btn btn-danger btn-sm">
          <Trash2 size={14} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export default EventCard;
