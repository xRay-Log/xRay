import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import Message from './Message';
import { LOG_LEVELS } from '../../constants';
import { formatTime } from '../../utils/formatters';

const LEVEL_COLORS = LOG_LEVELS.reduce((acc, { level, color }) => ({
  ...acc,
  [level.toUpperCase()]: color
}), {});

const getLevelColor = (level) => LEVEL_COLORS[level.toUpperCase()] || '#757575';

const LogHeader = memo(({ name, timestamp, level }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: getLevelColor(level) }}
      />
      <span className="font-medium text-gray-900 dark:text-gray-100">
        {name}
      </span>
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {formatTime(timestamp)}
      </span>
    </div>
    <span
      className="text-sm font-medium"
      style={{ color: getLevelColor(level) }}
    >
      {level}
    </span>
  </div>
));

const LogEntry = memo(({ log }) => (
  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3">
    <LogHeader
      name={log.name}
      timestamp={log.timestamp}
      level={log.level}
    />
    <div className="bg-white dark:bg-gray-800 rounded p-3">
      <Message data={log.message} />
    </div>
  </div>
));

const ModalHeader = memo(({ onClose }) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
      Compare Logs
    </h2>
    <button
      onClick={onClose}
      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
    >
      <FaTimes />
    </button>
  </div>
));

const CompareModal = ({ isOpen, onClose, logs }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[80vh] overflow-hidden"
        >
          <ModalHeader onClose={onClose} />
          <div className="grid grid-cols-2 gap-4 p-4 overflow-auto max-h-[calc(80vh-4rem)]">
            {logs.map((log) => (
              <LogEntry key={log.id} log={log} />
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default memo(CompareModal);
