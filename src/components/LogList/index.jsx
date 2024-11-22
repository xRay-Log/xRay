import React, { memo, useCallback } from 'react';
import { useLog } from '../../context/LogContext';
import LogItem from '../LogItem';
import EmptyState from './EmptyState';

const LogItemMemo = memo(({ log, isSelected, onSelect, selectionMode }) => (
  <LogItem 
    key={log.id} 
    log={log}
    isSelected={isSelected}
    onSelect={onSelect}
    selectionMode={selectionMode}
  />
));

const LogList = () => {
  const { 
    logs, 
    selectedLogs, 
    toggleLogSelection,
  } = useLog();

  const handleSelect = useCallback((logId) => {
    toggleLogSelection(logId);
  }, [toggleLogSelection]);

  if (logs.length === 0) {
    return <EmptyState />;
  }

  const selectionMode = selectedLogs.length > 0;

  return (
    <div className="space-y-2 p-4">
      {logs.map((log) => (
        <LogItemMemo 
          key={log.id} 
          log={log}
          isSelected={selectedLogs.includes(log.id)}
          onSelect={() => handleSelect(log.id)}
          selectionMode={selectionMode}
        />
      ))}
    </div>
  );
};

export default memo(LogList);
