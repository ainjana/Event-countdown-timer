import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createEvent } from '../api/events';
import { ArrowLeft, Calendar, Sparkles } from 'lucide-react';

export const CreateEvent = () => {
  // Default target date to tomorrow at 10:00 AM
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const defaultDate = tomorrow.toISOString().split('T')[0];
  const defaultTime = '10:00';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Trip');
  const [targetDate, setTargetDate] = useState(defaultDate);
  const [targetTime, setTargetTime] = useState(defaultTime);

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Event title is required.');
      return;
    }

    if (!targetDate || !targetTime) {
      setError('Target date and time are required.');
      return;
    }

    // Combine date and time into ISO string
    const combinedDateTime = new Date(`${targetDate}T${targetTime}:00`);
    if (isNaN(combinedDateTime.getTime())) {
      setError('Please provide a valid date and time.');
      return;
    }

    try {
      setSubmitting(true);
      await createEvent({
        title: title.trim(),
        description: description.trim(),
        category,
        target_date: combinedDateTime.toISOString(),
      });

      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to create event:', err);
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (data.title) setError(`Title error: ${data.title.join(' ')}`);
        else if (data.target_date) setError(`Date error: ${data.target_date.join(' ')}`);
        else setError('Failed to create event. Please check inputs.');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto 1.5rem' }}>
        <Link to="/dashboard" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </div>

      <div className="form-card" style={{ maxWidth: '600px' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            New <i className="serif-italic">Event Countdown</i>
          </h2>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>
            Set a title, category, and date for your upcoming milestone
          </p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Event Title *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Goa Trip, Birthday Bash, Product Launch"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Trip">Trip</option>
              <option value="Birthday">Birthday</option>
              <option value="Launch">Product Launch</option>
              <option value="Wedding">Wedding</option>
              <option value="Exam">Exam</option>
              <option value="Anniversary">Anniversary</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Target Date *</label>
              <input
                type="date"
                className="form-input"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Target Time *</label>
              <input
                type="time"
                className="form-input"
                value={targetTime}
                onChange={(e) => setTargetTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description (Optional)</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Add notes, travel plans, or reminder details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', marginTop: '1rem' }}
            disabled={submitting}
          >
            {submitting ? 'Creating Event...' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
