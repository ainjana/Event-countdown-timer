import React from 'react';

export const StatsOverview = ({ events = [] }) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const todayEnd = todayStart + 24 * 60 * 60 * 1000;

  const totalEvents = events.length;
  
  let upcoming = 0;
  let todayCount = 0;
  let completed = 0;

  events.forEach((event) => {
    const targetTime = new Date(event.target_date).getTime();
    if (targetTime <= now.getTime()) {
      completed += 1;
    } else {
      upcoming += 1;
      if (targetTime >= todayStart && targetTime < todayEnd) {
        todayCount += 1;
      }
    }
  });

  return (
    <div className="stats-container">
      <div className="stat-card dark">
        <div className="stat-title">Total Events</div>
        <div className="stat-value">{totalEvents}</div>
      </div>

      <div className="stat-card">
        <div className="stat-title">Upcoming</div>
        <div className="stat-value" style={{ color: '#2D5A37' }}>{upcoming}</div>
      </div>

      <div className="stat-card">
        <div className="stat-title">Today</div>
        <div className="stat-value" style={{ color: '#C85A32' }}>{todayCount}</div>
      </div>

      <div className="stat-card">
        <div className="stat-title">Done</div>
        <div className="stat-value" style={{ color: '#666666' }}>{completed}</div>
      </div>
    </div>
  );
};

export default StatsOverview;
