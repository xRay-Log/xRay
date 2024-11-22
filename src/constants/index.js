// API Constants

const BASE_URL = 'http://localhost:44827';

export const API_ENDPOINTS = {
  HEALTH: '/health',
  BASE_URL
};

// Database Constants
export const DB_CONSTANTS = {
  DB_NAME: 'xrayLogDB',
  DB_VERSION: 2,  // Increased version for the new store
  STORES: {
    LOGS: 'logs',
    BOOKMARKS: 'bookmarks'
  }
};

// Log Levels
export const LOG_LEVELS = [
  { level: 'error', color: '#EF4444' },
  { level: 'warning', color: '#F59E0B' },
  { level: 'info', color: '#3B82F6' },
  { level: 'debug', color: '#10B981' }
];

// Animation Constants
export const ANIMATION_VARIANTS = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

// Time Constants
export const TIME_INTERVALS = {
  SERVER_HEALTH_CHECK: 5000,
  TIME_UPDATE: 1000
};
