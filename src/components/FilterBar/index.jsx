import React, { memo } from 'react';
import { useLog } from '../../context/LogContext';
import { LOG_LEVELS } from '../../constants';

const LogLevelButton = memo(({ level, color, isSelected, onClick }) => (
  <button
    onClick={onClick}
    className="px-2 py-1 text-xs rounded-md capitalize transition-colors flex items-center space-x-1"
    style={{
      backgroundColor: isSelected ? `${color}15` : 'transparent',
      color: isSelected ? color : 'currentColor',
      border: `1px solid ${isSelected ? color : 'transparent'}`
    }}
  >
    <div
      className="w-1.5 h-1.5 rounded-full"
      style={{ backgroundColor: color }}
    />
    <span>{level}</span>
  </button>
));

const LogStats = memo(({ count, onClear }) => (
  <div className="flex items-center space-x-4">
    <div className="text-sm text-gray-500 dark:text-gray-400">
      {count} logs
    </div>
    <button
      onClick={onClear}
      className="px-3 py-1 text-sm text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
    >
      Clear All
    </button>
  </div>
));

const FilterBar = () => {
  const { 
    logs, 
    clearLogs,
    selectedLevels,
    setSelectedLevels
  } = useLog();

  const toggleLogLevel = (level) => {
    setSelectedLevels(prev => {
      const newSet = new Set(prev);
      if (newSet.has(level)) {
        newSet.delete(level);
      } else {
        newSet.add(level);
      }
      return newSet;
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10">
      <div className="flex items-center justify-between px-4 h-12">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {LOG_LEVELS.map(({ level, color }) => (
              <LogLevelButton
                key={level}
                level={level}
                color={color}
                isSelected={selectedLevels.has(level)}
                onClick={() => toggleLogLevel(level)}
              />
            ))}
          </div>
        </div>
        <LogStats count={logs.length} onClear={clearLogs} />
      </div>
    </div>
  );
};

export default memo(FilterBar);
