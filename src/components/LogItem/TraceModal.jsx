import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const TraceModal = ({ trace, onClose, darkMode }) => {
  if (!trace) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Trace Details
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 max-h-[70vh] overflow-auto">
            <pre className={`text-sm font-mono whitespace-pre-wrap rounded-md p-4 ${
              darkMode
                ? 'bg-gray-900 text-gray-300'
                : 'bg-gray-50 text-gray-800'
            }`}>
              {JSON.stringify(trace, null, 2)}
            </pre>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TraceModal;
