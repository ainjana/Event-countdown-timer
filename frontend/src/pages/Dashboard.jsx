import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getEvents, deleteEvent } from '../api/events';
import { StatsOverview } from '../components/StatsOverview';
import { FilterBar } from '../components/FilterBar';
import { EventCard } from '../components/EventCard';
import { ConfirmModal } from '../components/ConfirmModal';
import { Loading } from '../components/Loading';
import { Plus, CalendarX, Sparkles } from 'lucide-react';

export const Dashboard = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [ordering, setOrdering] = useState('target_date');

  // Deletion modal state
  const [eventToDelete, setEventToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUserEvents = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getEvents();
      setAllEvents(data);
    } catch (err) {
      console.error('Failed to load events:', err);
      setError('Unable to load events. Please check your backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserEvents();
  }, []);

  // Compute Category Counts for Filter Chips
  const categoryCounts = useMemo(() => {
    const counts = {};
    allEvents.forEach((ev) => {
      const cat = ev.category || 'Other';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [allEvents]);

  // Filtered & Sorted events for display
  const filteredEvents = useMemo(() => {
    return allEvents
      .filter((ev) => {
        // Category match
        if (selectedCategory !== 'All') {
          if ((ev.category || 'Other').toLowerCase() !== selectedCategory.toLowerCase()) {
            return false;
          }
        }
        // Search match
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const titleMatch = ev.title.toLowerCase().includes(query);
          const descMatch = (ev.description || '').toLowerCase().includes(query);
          if (!titleMatch && !descMatch) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (ordering === 'target_date') {
          return new Date(a.target_date) - new Date(b.target_date);
        } else if (ordering === '-target_date') {
          return new Date(b.target_date) - new Date(a.target_date);
        } else if (ordering === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [allEvents, selectedCategory, searchQuery, ordering]);

  // Handle Event Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;
    try {
      setIsDeleting(true);
      await deleteEvent(eventToDelete.id);
      
      // Update state locally without full page refresh
      setAllEvents((prev) => prev.filter((item) => item.id !== eventToDelete.id));
      setEventToDelete(null);
    } catch (err) {
      console.error('Failed to delete event:', err);
      alert('Failed to delete event. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div style={{ paddingTop: '1rem' }}>
      {/* Header Banner */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
            Event <i className="serif-italic">Dashboard</i>
          </h1>
          <p style={{ color: '#666', marginTop: '0.25rem', fontSize: '1rem' }}>
            Track and countdown your essential upcoming events in real-time
          </p>
        </div>

        <Link to="/events/new" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
          <Plus size={18} />
          <span>Add Event</span>
        </Link>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {/* Top Dashboard Stats */}
      <StatsOverview events={allEvents} />

      {/* Search & Category Filter Bar */}
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        ordering={ordering}
        setOrdering={setOrdering}
        categoryCounts={categoryCounts}
      />

      {/* Event Cards Content */}
      {loading ? (
        <Loading message="Fetching live event countdowns..." />
      ) : filteredEvents.length === 0 ? (
        <div className="empty-state">
          <div style={{ background: '#FAF9F5', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '1px solid #EAE8E2' }}>
            <CalendarX size={32} style={{ color: '#888' }} />
          </div>
          <h3>No upcoming events</h3>
          <p>Create your first event and start counting down!</p>
          <Link to="/events/new" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
            <Plus size={18} />
            <span>+ Add Event</span>
          </Link>
        </div>
      ) : (
        <div className="dashboard-grid">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onDeleteClick={(ev) => setEventToDelete(ev)}
            />
          ))}
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      <ConfirmModal
        isOpen={!!eventToDelete}
        title="Delete Event"
        message={`Are you sure you want to delete "${eventToDelete?.title}"?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setEventToDelete(null)}
        loading={isDeleting}
      />
    </div>
  );
};

export default Dashboard;
