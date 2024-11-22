import React, { useMemo, memo } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useLog } from '../../context/LogContext';
import LogItem from '../LogItem';
import { motion, AnimatePresence } from 'framer-motion';

const ModalHeader = memo(({ onClose }) => (
  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
      Compare Logs
    </h2>
    <button
      onClick={onClose}
      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
    >
      <FaTimes className="w-5 h-5 text-gray-500 dark:text-gray-400" />
    </button>
  </div>
));

const LogPanel = memo(({ log, index }) => (
  <div
    className={`flex-1 p-4 overflow-auto ${
      index === 0 ? 'border-r border-gray-200 dark:border-gray-700' : ''
    }`}
  >
    <div className="sticky top-0 pb-2 flex items-center justify-between bg-white dark:bg-gray-800">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Log {index + 1}
      </h3>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {new Date(log.timestamp).toLocaleString()}
      </div>
    </div>
    <LogItem
      log={log}
      isSelected={false}
      selectionMode={false}
      className="shadow-none border border-gray-200 dark:border-gray-700"
    />
  </div>
));

const CompareModal = () => {
  const { selectedLogs, isComparing, cancelComparison, logs } = useLog();

  const selectedLogObjects = useMemo(() => {
    return selectedLogs
      .map(logId => logs.find(log => log.id === logId))
      .filter(Boolean);
  }, [selectedLogs, logs]);

  if (!isComparing) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="compare-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      >
        <motion.div
          key="compare-modal"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-gray-800 w-[80%] h-[80%] rounded-lg shadow-xl flex flex-col"
        >
          <ModalHeader onClose={cancelComparison} />
          <div className="flex-1 flex overflow-hidden">
            {selectedLogObjects.map((log, index) => (
              <LogPanel
                key={`compare-log-${log.id}-${index}`}
                log={log}
                index={index}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default memo(CompareModal);