import React, { useMemo, memo, useCallback } from 'react';
import { FaFolder, FaBookmark } from 'react-icons/fa';
import { useLog } from '../../context/LogContext';

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

const SidebarButton = memo(({ icon: Icon, label, count, isActive, onClick }) => {
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
});

const SectionHeader = memo(({ title }) => (
  <div className="w-full px-3 py-2 flex items-center text-sm font-medium text-gray-700 dark:text-gray-200">
    <span className="uppercase tracking-wider text-xs">{title}</span>
  </div>
));

const ProjectsList = memo(({ 
  projects, 
  projectLogCounts, 
  selectedProject, 
  showBookmarksOnly, 
  onProjectClick, 
  onAllProjectsClick 
}) => (
  <div className="mb-2">
    <SectionHeader title="Projects" />
    <div className="space-y-0.5 py-1">
      <SidebarButton
        icon={FaFolder}
        label="All Projects"
        count={Object.values(projectLogCounts).reduce((a, b) => a + b, 0)}
        isActive={!selectedProject && !showBookmarksOnly}
        onClick={onAllProjectsClick}
      />
      <div className="pl-4">
        {projects.map((project) => (
          <SidebarButton
            key={project}
            icon={FaFolder}
            label={project}
            count={projectLogCounts[project]}
            isActive={selectedProject === project && !showBookmarksOnly}
            onClick={() => onProjectClick(project)}
          />
        ))}
      </div>
    </div>
  </div>
));

const BookmarkSection = memo(({ bookmarkedLogsCount, showBookmarksOnly, onBookmarksClick }) => (
  <div>
    <SectionHeader title="Bookmarks" />
    <div className="space-y-0.5 py-1">
      <SidebarButton
        icon={FaBookmark}
        label="Bookmarked Logs"
        count={bookmarkedLogsCount}
        isActive={showBookmarksOnly}
        onClick={onBookmarksClick}
      />
    </div>
  </div>
));

const Sidebar = () => {
  const { 
    projects, 
    selectedProject, 
    setSelectedProject, 
    allLogs,
    bookmarkedLogs,
    showBookmarksOnly,
    setShowBookmarksOnly
  } = useLog();

  const projectLogCounts = useMemo(() => {
    return projects.reduce((acc, project) => {
      acc[project] = allLogs.filter(log => log.project === project).length;
      return acc;
    }, {});
  }, [projects, allLogs]);

  const bookmarkedLogsCount = useMemo(() => 
    allLogs.filter(log => bookmarkedLogs.has(log.id)).length,
    [allLogs, bookmarkedLogs]
  );

  const handleAllProjectsClick = useCallback(() => {
    setSelectedProject(null);
    setShowBookmarksOnly(false);
  }, [setSelectedProject, setShowBookmarksOnly]);

  const handleProjectClick = useCallback((project) => {
    setSelectedProject(project);
    setShowBookmarksOnly(false);
  }, [setSelectedProject, setShowBookmarksOnly]);

  const handleBookmarksClick = useCallback(() => {
    setShowBookmarksOnly(true);
    setSelectedProject(null);
  }, [setShowBookmarksOnly, setSelectedProject]);

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="h-14 flex items-center px-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">xRay Logs</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <ProjectsList
          projects={projects}
          projectLogCounts={projectLogCounts}
          selectedProject={selectedProject}
          showBookmarksOnly={showBookmarksOnly}
          onProjectClick={handleProjectClick}
          onAllProjectsClick={handleAllProjectsClick}
        />
        <BookmarkSection
          bookmarkedLogsCount={bookmarkedLogsCount}
          showBookmarksOnly={showBookmarksOnly}
          onBookmarksClick={handleBookmarksClick}
        />
      </div>
    </div>
  );
};

export default memo(Sidebar);
