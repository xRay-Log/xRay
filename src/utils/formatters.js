import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco, dark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { LOG_LEVELS } from '../constants';

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};

export const getLevelColor = (level) => {
  const levelObj = LOG_LEVELS.find(l => l.level === level.toLowerCase());
  return levelObj?.color || '#757575';
};

export const formatLogMessage = (message, type, darkMode) => {
  if (typeof message === 'string') {
    if (type === 'code') {
      return {
        type: 'code',
        content: message,
        style: darkMode ? dark : docco
      };
    }
    return {
      type: 'text',
      content: message
    };
  }

  try {
    const formattedMessage = JSON.stringify(message, null, 2);
    return {
      type: 'json',
      content: formattedMessage,
      style: darkMode ? dark : docco
    };
  } catch (error) {
    return {
      type: 'text',
      content: String(message)
    };
  }
};
