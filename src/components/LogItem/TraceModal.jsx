import React, { memo, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCopy } from 'react-icons/fa';

const Header = memo(({ onClose, onCopy, copied }) => (
  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
      Trace Details
    </h3>
    <div className="flex items-center space-x-2">
      <button
        onClick={onCopy}
        className={`p-2 rounded-md ${
          copied
            ? 'text-green-500 bg-green-50 dark:bg-green-900/50'
            : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`}
        title="Copy to clipboard"
      >
        <FaCopy className="w-4 h-4" />
      </button>
      <button
        onClick={onClose}
        className="p-2 rounded-md text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <FaTimes className="w-4 h-4" />
      </button>
    </div>
  </div>
));

const Content = memo(({ trace, darkMode }) => (
  <div className="p-4 max-h-[70vh] overflow-auto">
    <pre className={`text-sm font-mono whitespace-pre-wrap rounded-md p-4 ${
      darkMode
        ? 'bg-gray-900 text-gray-300'
        : 'bg-gray-50 text-gray-800'
    }`}>
      {JSON.stringify(trace, null, 2)}
    </pre>
  </div>
));

const TraceModal = ({ trace, onClose, darkMode }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(trace, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy trace:', error);
    }
  }, [trace]);

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
          <Header onClose={onClose} onCopy={handleCopy} copied={copied} />
          <Content trace={trace} darkMode={darkMode} />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default memo(TraceModal);
