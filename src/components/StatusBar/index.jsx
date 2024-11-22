import React, { useState, memo, useCallback } from 'react';
import { FaExchangeAlt, FaTimes, FaCog, FaSun, FaMoon } from 'react-icons/fa';
import { useServerStatus } from '../../hooks';
import CompareModal from '../CompareModal';
import { useLog } from '../../context/LogContext';

const ServerInfoTooltip = memo(({ isConnected, show }) => {
  if (!show) return null;
  
  const serverInfo = [
    { label: 'Status', value: isConnected ? 'Connected' : 'Disconnected', color: isConnected ? 'text-green-500' : 'text-red-500' },
    { label: 'Server', value: 'localhost' },
    { label: 'Port', value: '44827' },
    { label: 'Protocol', value: 'HTTP' }
  ];

  return (
    <div className="absolute bottom-full left-0 mb-2 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg 
      border border-gray-200 dark:border-gray-700 min-w-[200px] z-50
      animate-in fade-in duration-200 slide-in-from-bottom-2"
    >
      <div className="space-y-1.5 text-xs">
        {serverInfo.map(({ label, value, color }) => (
          <div key={label} className="flex justify-between items-center">
            <span className="text-gray-500 dark:text-gray-400">{label}:</span>
            <span className={`font-medium ${color || ''}`}>{value}</span>
          </div>
        ))}
      </div>
      <div className="absolute -bottom-1 left-2 w-2 h-2 bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700 transform rotate-45" />
    </div>
  );
});

const StatusIndicator = memo(({ isConnected, showServerInfo, onToggle }) => (
  <div className="relative status-indicator">
    <div 
      className={`w-3 h-3 ${isConnected ? 'bg-green-500' : 'bg-red-500'} rounded-full cursor-pointer`}
      onClick={onToggle}
    >
      {isConnected && (
        <div className="absolute w-3 h-3 bg-green-500 rounded-full animate-ping" />
      )}
    </div>
    <ServerInfoTooltip isConnected={isConnected} show={showServerInfo} />
  </div>
));

const LogCount = memo(({ count }) => (
  <span className="text-sm text-gray-500 dark:text-gray-400">
    {count} logs
  </span>
));

const CompareButton = memo(({ isComparing, onStart, onCancel }) => {
  if (isComparing) {
    return (
      <button
        onClick={onCancel}
        className="px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm font-medium transition-colors"
      >
        Cancel
      </button>
    );
  }
  
  return (
    <button
      onClick={onStart}
      className="px-2.5 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors"
    >
      Compare
    </button>
  );
});

const SelectedLogs = memo(({ logs, onRemove }) => (
  <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded-md">
    {logs.map((log, index) => (
      <React.Fragment key={log.id}>
        <div className="flex items-center space-x-1">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Log {index + 1}
          </span>
          <button
            onClick={() => onRemove(log.id)}
            className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-gray-500 dark:text-gray-400"
          >
            <FaTimes className="w-3 h-3" />
          </button>
        </div>
        {index === 0 && logs.length === 2 && (
          <FaExchangeAlt className="w-3 h-3 text-gray-400 mx-1" />
        )}
      </React.Fragment>
    ))}
  </div>
));

const ThemeToggle = memo(({ darkMode, onToggle }) => (
  <button
    onClick={onToggle}
    className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
  >
    {darkMode ? (
      <FaSun className="w-4 h-4 text-gray-500 dark:text-gray-400" />
    ) : (
      <FaMoon className="w-4 h-4 text-gray-500 dark:text-gray-500" />
    )}
  </button>
));

const SettingsButton = memo(({ showSettings, onToggle, darkMode, onThemeToggle }) => (
  <div className="relative settings-tooltip">
    <button
      onClick={onToggle}
      className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      title="Settings"
    >
      <FaCog className="w-4 h-4" />
    </button>

    {showSettings && (
      <div className="absolute bottom-full right-0 mb-2 p-2.5 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
        <div className="space-y-2">
          <div className="flex items-center justify-between space-x-8">
            <span className="text-sm text-gray-600 dark:text-gray-300">Theme</span>
            <ThemeToggle darkMode={darkMode} onToggle={onThemeToggle} />
          </div>
        </div>
      </div>
    )}
  </div>
));

const StatusBar = () => {
  const { 
    logs, 
    darkMode, 
    setDarkMode,
    selectedLogs,
    setSelectedLogs,
    isComparing,
    startComparison,
    cancelComparison
  } = useLog();
  const { isConnected, showErrorModal, setShowErrorModal, lastError } = useServerStatus();
  
  const [showServerInfo, setShowServerInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleRemoveLog = useCallback((logId) => {
    setSelectedLogs(prev => prev.filter(l => l.id !== logId));
  }, [setSelectedLogs]);

  const toggleServerInfo = useCallback(() => {
    setShowServerInfo(prev => !prev);
  }, []);

  const toggleSettings = useCallback(() => {
    setShowSettings(prev => !prev);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev);
  }, [setDarkMode]);

  return (
    <>
      <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <StatusIndicator 
              isConnected={isConnected} 
              showServerInfo={showServerInfo}
              onToggle={toggleServerInfo}
            />
            <div className="flex items-center space-x-2">
              <LogCount count={logs.length} />
              
              {selectedLogs.length > 0 && (
                <>
                  <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-2" />
                  <div className="flex items-center space-x-2">
                    <SelectedLogs logs={selectedLogs} onRemove={handleRemoveLog} />
                    {selectedLogs.length === 2 && (
                      <CompareButton 
                        isComparing={isComparing}
                        onStart={startComparison}
                        onCancel={cancelComparison}
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-3">
          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
          <SettingsButton 
            showSettings={showSettings}
            onToggle={toggleSettings}
            darkMode={darkMode}
            onThemeToggle={toggleDarkMode}
          />
        </div>
      </div>

      <CompareModal />
    </>
  );
};

export default memo(StatusBar);
