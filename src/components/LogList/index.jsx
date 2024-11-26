import React, { memo, useCallback } from 'react';
import { useLog } from '../../context/LogContext';
import LogItem from '../LogItem';
import EmptyState from './EmptyState';
import CompareModal from './CompareModal';

const LogList = () => {
  const {
    logs,
    selectedLogs,
    isComparing,
    toggleLogSelection,
    cancelComparison,
  } = useLog();

  const handleSelect = useCallback((logId) => {
    toggleLogSelection(logId);
  }, [toggleLogSelection]);

  if (logs.length === 0) {
    return <EmptyState />;
  }

  const selectionMode = selectedLogs.length > 0;
  //console.log("comparing", isComparing);
  return (
    <>
      <div className="space-y-2 p-4" role="log">
        {logs.map((log) => (
          <LogItem 
            key={log.id} 
            log={log}
            isSelected={selectedLogs.includes(log.id)}
            onSelect={() => handleSelect(log.id)}
            selectionMode={selectionMode}
          />
        ))}
      </div>
      {isComparing && (
        <CompareModal
          isOpen={isComparing}
          logs={logs.filter(log => selectedLogs.includes(log.id))}
          onClose={cancelComparison}
        />
      )}
    </>
  );
};

export default (LogList);
