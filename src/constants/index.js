// API Constants

const BASE_URL = 'http://localhost:44827';

export const API_ENDPOINTS = {
  HEALTH: '/health',
  BASE_URL
};

// Log Levels
export const LOG_LEVELS = [
  { level: 'error', color: '#ef4444', label: 'Error' },
  { level: 'warning', color: '#f59e0b', label: 'Warning' },
  { level: 'info', color: '#3b82f6', label: 'Info' },
  { level: 'debug', color: '#10b981', label: 'Debug' }
];

// Time Constants
export const TIME_INTERVALS = {
  SERVER_HEALTH_CHECK: 5000
};
