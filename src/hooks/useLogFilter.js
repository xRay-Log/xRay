import { useMemo } from 'react';

const matchesSearchQuery = (log, query) => {
  const lowerQuery = query.toLowerCase();
  return (
    log.message.toLowerCase().includes(lowerQuery) ||
    log.level.toLowerCase().includes(lowerQuery) ||
    log.timestamp.toLowerCase().includes(lowerQuery)
  );
};

const useLogFilter = (logs, searchQuery, selectedLevels, selectedProject) => 
  useMemo(() => logs.filter(log => {
    if (selectedProject && log.projectId !== selectedProject.id) return false;
    if (selectedLevels.size > 0 && !selectedLevels.has(log.level)) return false;
    if (searchQuery) return matchesSearchQuery(log, searchQuery);
    return true;
  }), [logs, searchQuery, selectedLevels, selectedProject]);

export default useLogFilter;
