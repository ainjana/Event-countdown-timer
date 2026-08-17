import React, { useState, useEffect } from 'react';
import { calculateRemainingTime, padZero } from '../utils/countdownUtils';

export const Countdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(() => calculateRemainingTime(targetDate));

  useEffect(() => {
    // Initial calculation
    setTimeLeft(calculateRemainingTime(targetDate));

    // Update countdown every 1 second entirely on client
    const timer = setInterval(() => {
      const remaining = calculateRemainingTime(targetDate);
      setTimeLeft(remaining);

      // Stop timer if event is reached
      if (remaining.isCompleted) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.isCompleted) {
    return (
      <div className="countdown-completed">
        🎉 Event Started!
      </div>
    );
  }

  return (
    <div className="countdown-box">
      <div className="countdown-digits">
        {!timeLeft.isLessThanDay && (
          <>
            <div className="countdown-unit">
              <span className="countdown-num">{padZero(timeLeft.days)}</span>
              <span className="countdown-label">Days</span>
            </div>
            <span className="countdown-colon">:</span>
          </>
        )}

        <div className="countdown-unit">
          <span className="countdown-num">{padZero(timeLeft.hours)}</span>
          <span className="countdown-label">Hours</span>
        </div>
        <span className="countdown-colon">:</span>

        <div className="countdown-unit">
          <span className="countdown-num">{padZero(timeLeft.minutes)}</span>
          <span className="countdown-label">Minutes</span>
        </div>
        <span className="countdown-colon">:</span>

        <div className="countdown-unit">
          <span className="countdown-num">{padZero(timeLeft.seconds)}</span>
          <span className="countdown-label">Seconds</span>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
