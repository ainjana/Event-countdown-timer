import React from 'react';
import { Loader2 } from 'lucide-react';

export const Loading = ({ message = 'Loading events...' }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem' }}>
      <Loader2 className="animate-spin" size={36} style={{ color: '#111111', animation: 'spin 1s linear infinite' }} />
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <p style={{ marginTop: '1rem', color: '#666666', fontSize: '0.9rem', fontWeight: 500 }}>{message}</p>
    </div>
  );
};

export default Loading;
