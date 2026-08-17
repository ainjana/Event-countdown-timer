import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEventById, updateEvent } from '../api/events';
import { Loading } from '../components/Loading';
import { ArrowLeft } from 'lucide-react';

export const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Other');
  const [targetDate, setTargetDate] = useState('');
  const [targetTime, setTargetTime] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const data = await getEventById(id);
        setTitle(data.title || '');
        setDescription(data.description || '');
        setCategory(data.category || 'Other');

        if (data.target_date) {
          const dt = new Date(data.target_date);
          // Format date as YYYY-MM-DD
          const year = dt.getFullYear();
          const month = String(dt.getMonth() + 1).padStart(2, '0');
          const day = String(dt.getDate()).padStart(2, '0');
          setTargetDate(`${year}-${month}-${day}`);

          // Format time as HH:MM
          const hours = String(dt.getHours()).padStart(2, '0');
          const minutes = String(dt.getMinutes()).padStart(2, '0');
          setTargetTime(`${hours}:${minutes}`);
        }
      } catch (err) {
        console.error('Failed to load event for editing:', err);
        setError('Event not found or unauthorized access.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

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

    const combinedDateTime = new Date(`${targetDate}T${targetTime}:00`);
    if (isNaN(combinedDateTime.getTime())) {
      setError('Please provide a valid date and time.');
      return;
    }

    try {
      setSubmitting(true);
      await updateEvent(id, {
        title: title.trim(),
        description: description.trim(),
        category,
        target_date: combinedDateTime.toISOString(),
      });

      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to update event:', err);
      if (err.response && err.response.data) {
        setError(JSON.stringify(err.response.data));
      } else {
        setError('Network error. Failed to save changes.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loading message="Loading event details..." />;
  }

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
            Edit <i className="serif-italic">Event</i>
          </h2>
          <p style={{ color: '#666', fontSize: '0.95rem' }}>
            Update event title, category, target date, or description
          </p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Event Title *</label>
            <input
              type="text"
              className="form-input"
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
            {submitting ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
