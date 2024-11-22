import { useState, useCallback } from 'react';

export const useLogSelection = (initialValue = []) => {
  const [selectedLogs, setSelectedLogs] = useState(initialValue);

  const handleLogSelect = useCallback((log) => {
    setSelectedLogs((prev) => {
      if (prev.some(l => l.id === log.id)) {
        return prev.filter(l => l.id !== log.id);
      }
      if (prev.length >= 2) return prev;
      return [...prev, log];
    });
  }, []);

  return {
    selectedLogs,
    setSelectedLogs,
    handleLogSelect
  };
};

export default useLogSelection;
