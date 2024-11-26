import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import LogItem from '../LogItem/index';

const CompareModal = ({ isOpen, onClose, logs = [] }) => {
  //console.group('CompareModal');
  //console.log(isOpen);
  //console.log(logs.length);
  if (!isOpen || logs.length !== 2) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl mx-4 overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Compare Logs
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4 max-h-[80vh] overflow-auto">
            {logs.map((log) => (
              <div key={log.id} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                <LogItem 
                  log={log}
                  hideActions={true}
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default memo(CompareModal);
