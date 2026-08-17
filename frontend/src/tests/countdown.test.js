import { describe, it, expect } from 'vitest';
import { calculateRemainingTime, padZero, formatDate } from '../utils/countdownUtils';

describe('Countdown Utility Functions', () => {
  it('correctly calculates remaining time for future date (> 24 hours)', () => {
    const targetMs = Date.now() + (2 * 24 * 3600 * 1000) + (3 * 3600 * 1000) + (10 * 60 * 1000);
    const futureDate = new Date(targetMs).toISOString();
    const result = calculateRemainingTime(futureDate);

    expect(result.days).toBe(2);
    expect(result.hours).toBe(3);
    expect(result.isCompleted).toBe(false);
    expect(result.isLessThanDay).toBe(false);
  });

  it('detects when remaining time is less than 1 day (< 24 hours)', () => {
    const futureDate = new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString();
    const result = calculateRemainingTime(futureDate);

    expect(result.days).toBe(0);
    expect(result.hours).toBe(5);
    expect(result.isCompleted).toBe(false);
    expect(result.isLessThanDay).toBe(true);
  });

  it('handles past target dates as completed', () => {
    const pastDate = new Date(Date.now() - 10000).toISOString();
    const result = calculateRemainingTime(pastDate);

    expect(result.days).toBe(0);
    expect(result.hours).toBe(0);
    expect(result.minutes).toBe(0);
    expect(result.seconds).toBe(0);
    expect(result.isCompleted).toBe(true);
  });

  it('pads single digits with leading zero', () => {
    expect(padZero(5)).toBe('05');
    expect(padZero(0)).toBe('00');
    expect(padZero(12)).toBe('12');
  });

  it('formats ISO date string into readable format', () => {
    const formatted = formatDate('2026-12-20T10:00:00Z');
    expect(formatted).toContain('2026');
    expect(formatted).toContain('Dec');
  });
});
