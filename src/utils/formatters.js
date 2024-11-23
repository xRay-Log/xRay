import { LOG_LEVELS } from '../constants';

export const formatTime = (date) => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

export const getLevelColor = (level) => {
  const logLevel = LOG_LEVELS.find(l => l.level.toLowerCase() === level.toLowerCase());
  return logLevel ? logLevel.color : LOG_LEVELS[2].color; // default to info color
};
