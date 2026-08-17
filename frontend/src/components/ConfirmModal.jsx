import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ background: '#FEE2E2', color: '#DC2626', padding: '0.6rem', borderRadius: '50%' }}>
            <AlertTriangle size={24} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{title || 'Confirm Action'}</h3>
        </div>

        <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '1.75rem', lineHeight: 1.5 }}>
          {message || 'Are you sure you want to delete this event?'}
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button onClick={onCancel} className="btn btn-secondary" disabled={loading}>
            Cancel
          </button>
          <button onClick={onConfirm} className="btn btn-danger" disabled={loading}>
            {loading ? 'Deleting...' : 'Delete Event'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
