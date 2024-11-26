import React, { useState, memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  FaInfoCircle, FaBookmark, FaRegBookmark, 
  FaExchangeAlt, FaTrash, FaCopy, FaCheck 
} from 'react-icons/fa';
import { useLog } from '../../context/LogContext';
import { formatTime } from '../../utils/formatters';
import TraceDetailsModal from './TraceModal';
import Message from './Message';

const ActionButton = memo(({ onClick, className, title, icon: Icon }) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
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

const SelectionCheckbox = memo(({ isSelected }) => (
  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
    ${isSelected 
      ? 'border-blue-500 bg-blue-500' 
      : 'border-gray-300 dark:border-gray-600'
    }`}
  >
    {isSelected && <FaCheck className="w-3 h-3 text-white" />}
  </div>
));

const LogLevel = memo(({ level }) => {
  const getLogLevelClass = (level) => {
    switch (level?.toLowerCase()) {
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'info':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'debug':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-md ${getLogLevelClass(level)}`}>
      {(level || 'INFO').toUpperCase()}
    </span>
  );
});

const LogActions = memo(({ 
  log, 
  bookmarkedLogs, 
  onTraceClick, 
  onBookmarkToggle, 

  onDelete,
  onCompare,
  selectionMode,
  hideActions = false
}) => {
  if (hideActions) return null;
  
  return (
    <div className="flex items-center space-x-1">
      {log.trace && (
        <ActionButton
          onClick={() => onTraceClick(log.trace)}
          title="View Trace Details"
          icon={FaInfoCircle}
        />
      )}
      <ActionButton
        onClick={() => onBookmarkToggle(log)}
        title={bookmarkedLogs.has(log.id) ? "Remove Bookmark" : "Add Bookmark"}
        icon={bookmarkedLogs.has(log.id) ? FaBookmark : FaRegBookmark}
        className={bookmarkedLogs.has(log.id) ? "text-blue-500" : ""}
      />
      {!selectionMode && (
        <>
          <ActionButton
            onClick={onCompare}
            title="Compare Log"
            icon={FaExchangeAlt}
          />
          <ActionButton
            onClick={() => onDelete(log.id)}
            title="Delete Log"
            icon={FaTrash}
            className="hover:text-red-500 dark:hover:text-red-400
              hover:bg-red-50 dark:hover:bg-red-900/20"
          />
        </>
      )}
    </div>
  );
});

const LogHeader = memo(({ log, darkMode }) => (
  <div className="flex items-center space-x-4">
    <LogLevel level={log.level} />
    <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
      {formatTime(log.timestamp || new Date())}
    </span>
  </div>
));

const LogItem = ({ log, isSelected, onSelect, selectionMode, hideActions = false }) => {
  const { darkMode, deleteLog, startComparison, selectedLogs,bookmarkedLogs,toggleBookmark } = useLog();
  const [copiedLogId, setCopiedLogId] = useState(null);
  const [showTraceModal, setShowTraceModal] = useState(false);
  const [currentTrace, setCurrentTrace] = useState(null);

  const handleTraceClick = useCallback((trace) => {
    try {
      const traceData = trace;
      setCurrentTrace(traceData);
      setShowTraceModal(true);
    } catch (error) {
      console.error('Error parsing trace data:', error);
      setCurrentTrace(trace);
      setShowTraceModal(true);
    }
  }, []);

  const handleCopyLog = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(log.message || '');
      setCopiedLogId(log.id);
      setTimeout(() => setCopiedLogId(null), 2000);
    } catch (error) {
      console.error('Failed to copy log:', error);
    }
  }, [log]);

  const handleCompare = useCallback(() => {
    onSelect(log.id);
    if (selectedLogs.length === 1) {
      startComparison();
    }
  }, [log.id, selectedLogs.length, onSelect, startComparison]);

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
        onClick={selectionMode ? () => onSelect(log.id) : undefined}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {selectionMode && <SelectionCheckbox isSelected={isSelected} />}
            <LogHeader log={log} darkMode={darkMode} />
          </div>

          <LogActions
            log={log}
            bookmarkedLogs={bookmarkedLogs}
            onTraceClick={handleTraceClick}
            onBookmarkToggle={toggleBookmark}
            onSelect={onSelect}
            onDelete={deleteLog}
            onCompare={handleCompare}
            selectionMode={selectionMode}
            hideActions={hideActions}
          />
        </div>

        <div className="mt-3 relative group">
          <div className="font-mono text-sm whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 rounded p-4">
            <Message data={log.message || ''} />
          </div>
          
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyButton
              onClick={handleCopyLog}
              isCopied={copiedLogId === log.id}
            />
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
