import React, { useMemo, useState, useEffect, useContext } from 'react';
import { FaFolder, FaBookmark } from 'react-icons/fa';
import { useLog } from '../../context/LogContext';
import { useServerStatus } from '../../hooks';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db';

const getButtonClasses = (isActive) => ({
  container: `w-full flex items-center justify-between px-3 py-1.5 text-sm transition-all duration-150 ${
    isActive
      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
  }`,
  badge: `text-xs px-1.5 py-0.5 rounded-full ${
    isActive
      ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
  }`,
  icon: isActive ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
});

const Sidebar = () => {
  const { 
    projects, 
    selectedProject, 
    showBookmarksOnly,
    updateFilters
  } = useLog();

  const { isConnected } = useServerStatus();

  // Use Dexie live queries for real-time updates
  const totalLogsCount = useLiveQuery(() => db.liveTotalLogsCount()) || 0;
  const projectCounts = useLiveQuery(() => db.liveProjectCounts()) || {};
  const bookmarksCount = useLiveQuery(() => db.liveBookmarksCount()) || 0;

  const renderSidebarButton = ({ icon: Icon, label, count, isActive, onClick }) => {
    const classes = getButtonClasses(isActive);
    return (
      <button onClick={onClick} className={classes.container}>
        <div className="flex items-center space-x-2">
          <Icon className={`w-4 h-4 ${classes.icon}`} />
          <span>{label}</span>
        </div>
        <span className={classes.badge}>{count}</span>
      </button>
    );
  };

  const renderSectionHeader = (title) => (
    <div className="w-full px-3 py-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-200">
      <span className="uppercase tracking-widest text-xs">{title}</span>
    </div>
  );

  return (
    <div className="w-64 bg-white dark:bg-gray-800 dark:border-gray-700 flex flex-col">
      <div className="h-14 flex items-center px-4 bg-gray-50 dark:bg-gray-800/80">
        <div className="flex items-center space-x-2">
          <div className={`w-4 h-4 ${isConnected ? 'bg-green-500' : 'bg-red-500'} rounded-full animate-pulse`}></div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">xRay</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <div className="mb-2">
          {renderSectionHeader('Projects')}
          <div className="space-y-0.5 py-1">
            {renderSidebarButton({
              icon: FaFolder,
              label: "All Projects",
              count: totalLogsCount,
              isActive: !selectedProject && !showBookmarksOnly,
              onClick: () => {
                updateFilters({ project: null, bookmark: false });
              }
            })}
            <div className="pl-4">
              {projects.map((project) => (
                <div key={project}>
                  {renderSidebarButton({
                    icon: FaFolder,
                    label: project,
                    count: projectCounts[project] || 0,
                    isActive: selectedProject === project && !showBookmarksOnly,
                    onClick: () => {
                      updateFilters({ project, bookmark: false });
                    }
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          {renderSectionHeader('Views')}
          <div className="space-y-0.5 py-1">
            {renderSidebarButton({
              icon: FaBookmark,
              label: "Bookmarks",
              count: bookmarksCount,
              isActive: showBookmarksOnly,
              onClick: () => {
                updateFilters({ project: null, bookmark: true });
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
