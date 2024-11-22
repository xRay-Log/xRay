import React, { useState, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  FaInfoCircle, FaBookmark, FaRegBookmark, 
  FaExchangeAlt, FaTrash, FaCopy, FaDownload, FaCheck 
} from 'react-icons/fa';
import { useLog } from '../../context/LogContext';
import { useBookmarks } from '../../hooks';
import { formatTime, getLevelColor } from '../../utils/formatters';
import TraceDetailsModal from './TraceModal';
import Message from './Message';

const ActionButton = memo(({ onClick, className, title, icon: Icon, stopPropagation = true }) => (
  <button
    onClick={(e) => {
      if (stopPropagation) e.stopPropagation();
      onClick(e);
    }}
    className={`p-2 rounded-lg text-gray-400 hover:text-gray-600 
      dark:text-gray-500 dark:hover:text-gray-300 
      hover:bg-gray-100 dark:hover:bg-gray-700 
      transition-colors ${className || ''}`}
    title={title}
  >
    <Icon className="w-4 h-4" />
  </button>
));

const CopyButton = memo(({ onClick, isCopied }) => (
  <button
    onClick={onClick}
    className="h-8 px-2 rounded-md bg-white dark:bg-gray-800 shadow-sm 
      hover:bg-gray-50 dark:hover:bg-gray-700 
      transition-colors flex items-center space-x-1.5"
    title="Copy Log"
  >
    <FaCopy className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
    <motion.div
      initial={{ opacity: 0, width: 0 }}
      animate={{ 
        opacity: isCopied ? 1 : 0,
        width: isCopied ? 'auto' : 0
      }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <span className="text-gray-500 dark:text-gray-400 text-xs font-medium whitespace-nowrap">
        Copied!
      </span>
    </motion.div>
  </button>
));

const LogHeader = memo(({ log, darkMode, levelColor }) => (
  <div className="flex items-center space-x-4">
    <div
      className="w-2 h-2 rounded-full"
      style={{ backgroundColor: levelColor }}
    />
    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
      {formatTime(log.timestamp || new Date())}
    </span>
    <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
      {(log.level || 'INFO').toUpperCase()}
    </span>
  </div>
));

const LogItem = ({ log, isSelected, onSelect, selectionMode }) => {
  const { darkMode, deleteLog } = useLog();
  const { bookmarkedLogs, handleBookmarkToggle } = useBookmarks();
  const [copiedLogId, setCopiedLogId] = useState(null);
  const [showTraceModal, setShowTraceModal] = useState(false);
  const [currentTrace, setCurrentTrace] = useState(null);

  const levelColor = getLevelColor(log.level || 'info');

  const handleTraceClick = useCallback((trace) => {
    if (!trace) return;
    try {
      const traceData = typeof trace === 'string' ? JSON.parse(trace) : trace;
      setCurrentTrace(traceData);
      setShowTraceModal(true);
    } catch (error) {
      console.error('Error parsing trace data:', error);
      setCurrentTrace(trace);
      setShowTraceModal(true);
    }
  }, []);

  const handleCopyLog = useCallback(async (log) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(log, null, 2));
      setCopiedLogId(log.id);
      setTimeout(() => setCopiedLogId(null), 2000);
    } catch (error) {
      console.error('Failed to copy log:', error);
    }
  }, []);

  const handleDownloadLog = useCallback(async (log) => {
    try {
      const blob = new Blob([JSON.stringify(log, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `log-${log.id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download log:', error);
    }
  }, []);

  return (
    <>
      <motion.div
        key={log.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 ${
          darkMode ? 'text-gray-300' : 'text-gray-800'
        } ${
          selectionMode ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700' : ''
        } ${
          isSelected ? 'ring-2 ring-blue-500' : ''
        }`}
        onClick={selectionMode ? onSelect : undefined}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {selectionMode && (
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                ${isSelected 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                {isSelected && <FaCheck className="w-3 h-3 text-white" />}
              </div>
            )}
            <LogHeader log={log} darkMode={darkMode} levelColor={levelColor} />
          </div>

          <div className="flex items-center space-x-1">
            {log.trace && (
              <ActionButton
                onClick={() => handleTraceClick(log.trace)}
                title="View Trace Details"
                icon={FaInfoCircle}
              />
            )}
            <ActionButton
              onClick={() => handleBookmarkToggle(log)}
              title={bookmarkedLogs.has(log.id) ? "Remove Bookmark" : "Add Bookmark"}
              icon={bookmarkedLogs.has(log.id) ? FaBookmark : FaRegBookmark}
              className={bookmarkedLogs.has(log.id) ? "text-blue-500" : ""}
            />
            {!selectionMode && (
              <>
                <ActionButton
                  onClick={onSelect}
                  title="Compare Log"
                  icon={FaExchangeAlt}
                />
                <ActionButton
                  onClick={() => deleteLog(log.id)}
                  title="Delete Log"
                  icon={FaTrash}
                  className="hover:text-red-500 dark:hover:text-red-400
                    hover:bg-red-50 dark:hover:bg-red-900/20"
                />
              </>
            )}
          </div>
        </div>

        <div className="mt-3 relative group">
          <div className="font-mono text-sm whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 rounded relative z-0">
            <Message data={log.message || ''} />
          </div>
          
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1.5 z-10">
            <CopyButton
              onClick={() => handleCopyLog(log)}
              isCopied={copiedLogId === log.id}
            />

            <button
              onClick={() => handleDownloadLog(log)}
              className="h-8 px-2 rounded-md bg-white dark:bg-gray-800 shadow-sm 
                hover:bg-gray-50 dark:hover:bg-gray-700 
                transition-colors flex items-center"
              title="Download Log"
            >
              <FaDownload className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
            </button>
          </div>
        </div>
      </motion.div>

      {showTraceModal && (
        <TraceDetailsModal
          isOpen={showTraceModal}
          onClose={() => setShowTraceModal(false)}
          trace={currentTrace}
        />
      )}
    </>
  );
};

export default memo(LogItem);
