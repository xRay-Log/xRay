import React, { useContext } from 'react';
import { LogContext, useLog } from '../../context/LogContext';
import { LOG_LEVELS } from '../../constants';

const FilterBar = () => {
  const { 
    clearLogs,
    selectedLevels,
    updateFilters,
    totalLogsCount
  } = useLog();

  const toggleLogLevel = (logLevel) => {
    if (selectedLevels.has(logLevel)) {
      updateFilters({
        levels: new Set([...selectedLevels].filter(level => level !== logLevel))
      });
    } else {
      updateFilters({
        levels: new Set([...selectedLevels, logLevel])
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 z-10">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center space-x-1">
          {LOG_LEVELS.map(({ level, color }) => (
            <button
              key={level}
              onClick={() => toggleLogLevel(level)}
              className="px-2 py-1 text-xs rounded-md capitalize transition-colors flex items-center space-x-1"
              style={{
                backgroundColor: selectedLevels.has(level) ? `${color}15` : 'transparent',
                color: selectedLevels.has(level) ? color : 'currentColor',
                border: `1px solid ${selectedLevels.has(level) ? color : 'transparent'}`
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span>{level}</span>
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {totalLogsCount} logs
          </div>
          <button
            onClick={clearLogs}
            className="px-3 py-1 text-sm text-red-500 dark:text-red-400"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
