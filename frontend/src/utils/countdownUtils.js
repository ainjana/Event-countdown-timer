export const calculateRemainingTime = (targetDate) => {
  const target = new Date(targetDate).getTime();
  const now = Date.now();
  const difference = target - now;

  if (difference <= 0 || isNaN(difference)) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isCompleted: true,
      isLessThanDay: false,
    };
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  const isLessThanDay = days === 0;

  return {
    days,
    hours,
    minutes,
    seconds,
    isCompleted: false,
    isLessThanDay,
  };
};

export const padZero = (num) => {
  return String(num).padStart(2, '0');
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};
