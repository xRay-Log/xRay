import React, { useState, useCallback } from 'react';
import { FaExchangeAlt, FaTimes, FaCog, FaSun, FaMoon, FaGithub } from 'react-icons/fa';
import { useServerStatus } from '../../hooks';
import { useLog } from '../../context/LogContext';
import { open } from '@tauri-apps/plugin-shell';

const ServerInfoTooltip = ({ isConnected, show }) => {
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
      animate-in fade-in duration-200 slide-in-from-bottom-2">
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
};

const StatusBar = () => {
  const { 
    darkMode, 
    setDarkMode,
    selectedLogs,
    setSelectedLogs,
    isComparing,
    startComparison,
    cancelComparison,
    totalLogsCount
  } = useLog();
  const { isConnected } = useServerStatus();
  
  const [showServerInfo, setShowServerInfo] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const handleRemoveLog = useCallback((logId) => {
    setSelectedLogs(prev => prev.filter(l => l.id !== logId));
  }, [setSelectedLogs]);

  return (
    <div className="flex items-center justify-between w-full h-10 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-4 px-4">
        <div className="flex items-center space-x-2">
          <div className="relative status-indicator">
            <div 
              className={`w-3 h-3 ${isConnected ? 'bg-green-500' : 'bg-red-500'} rounded-full cursor-pointer`}
              onClick={() => setShowServerInfo(prev => !prev)}
            >
              {isConnected && (
                <div className="absolute w-3 h-3 bg-green-500 rounded-full animate-ping" />
              )}
            </div>
            <ServerInfoTooltip isConnected={isConnected} show={showServerInfo} />
          </div>
          
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {totalLogsCount} logs
          </span>

          {selectedLogs.length > 0 && (
            <>
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-2" />
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded-md">
                  {selectedLogs.map((log, index) => (
                    <React.Fragment key={log.id}>
                      <div className="flex items-center space-x-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Log {index + 1}
                        </span>
                        <button
                          onClick={() => handleRemoveLog(log.id)}
                          className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-gray-500 dark:text-gray-400"
                        >
                          <FaTimes className="w-3 h-3" />
                        </button>
                      </div>
                      {index === 0 && selectedLogs.length === 2 && (
                        <FaExchangeAlt className="w-3 h-3 text-gray-400 mx-1" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                {selectedLogs.length === 2 && (
                  <button
                    onClick={isComparing ? cancelComparison : startComparison}
                    className={`px-2.5 py-1 ${isComparing ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-md text-sm font-medium transition-colors`}
                  >
                    {isComparing ? 'Cancel' : 'Compare'}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-4 px-4">
        <div className="flex items-center space-x-4">
          <a
            href="https://github.com/xRay-Log/xRay"
            target="_blank"
            className="cursor-pointer flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <FaGithub className="w-4 h-4" />
            <span className="text-sm">GitHub</span>
          </a>

          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>

          <div className="relative settings-tooltip">
            <button
              onClick={() => setShowSettings(prev => !prev)}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              <FaCog className="w-4 h-4" />
              <span className="text-sm">Settings</span>
            </button>

            {showSettings && (
              <div className="absolute bottom-full right-0 mb-2 p-2.5 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="space-y-2">
                  <div className="flex items-center justify-between space-x-8">
                    <span className="text-sm text-gray-600 dark:text-gray-300">Theme</span>
                    <button
                      onClick={() => setDarkMode(prev => !prev)}
                      className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      {darkMode ? (
                        <FaSun className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      ) : (
                        <FaMoon className="w-4 h-4 text-gray-500 dark:text-gray-500" />
                      )}
                    </button>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                    <a
                      href="https://www.buymeacoffee.com/muhammetus"
                      target="_blank"
                    >
                      <img
                        src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
                        alt="Buy Me A Coffee"
                        className="h-8 w-auto hover:opacity-90 transition-opacity"
                      />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusBar;
