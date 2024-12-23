import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { listen } from '@tauri-apps/api/event';
import { db } from '../db/xRayDb';
import { LOG_LEVELS } from '../constants';
import { useLiveQuery } from 'dexie-react-hooks';

export const LogContext = createContext(null);

const getInitialDarkMode = () => {
  const savedTheme = localStorage.getItem('theme');
  return savedTheme === 'dark' || 
         (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
};

const processLogData = (data) => ({
  id: uuidv4(),
  timestamp: new Date().toISOString(),
  level: data.level.toLowerCase(),
  project: data.project,
  message: data.payload,
  trace: data.trace || null
});

const useDatabase = ( setProjects) => {
  
  const unlistenRef = useRef(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (isInitializedRef.current) return;
    console.log("start xRay database");
    const initialize = async () => {
      try {
        await db.init();

        const [projectList, bookmarkIds] = await Promise.all([
          db.getAllProjects()
        ]);

        const bookmarkSet = new Set(bookmarkIds);
        setProjects(projectList);
      

        if (!unlistenRef.current) {
          unlistenRef.current = await listen('log', async (event) => {
            try {
              const logData = processLogData(JSON.parse(event.payload));
              await db.addLog(logData);
              
              setProjects(prevProjects => {
                if (prevProjects.includes(logData.project)) return prevProjects;
                return [...prevProjects, logData.project];
              });
            } catch (error) {
              console.error('Log processing error:', error);
            }
          });
        }

        isInitializedRef.current = true;
      } catch (error) {
        console.error('Database initialization error:', error);
      }
    };

    initialize();

    return () => {
      if (unlistenRef.current) {
        unlistenRef.current();
        unlistenRef.current = null;
      }
      isInitializedRef.current = false;
    };
  }, [isInitializedRef]);
};

const useThemeEffect = (darkMode) => {
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);
};

export const LogProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [selectedLogs, setSelectedLogs] = useState([]);
  const [isComparing, setIsComparing] = useState(false);
  const [bookmarkedLogs, setBookmarkedLogs] = useState(new Set());
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);
  const [filters, setFilters] = useState({
    levels: new Set(LOG_LEVELS.map(({ level }) => level)),
    project: null,
    bookmark: false
  });

  const logs = useLiveQuery(
    () => db.liveFilteredLogs(filters),
    [filters]
  ) || [];

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  useDatabase(setProjects);
  
  useThemeEffect(darkMode);

  const deleteLog = useCallback(async (logId) => {
    try {
      await db.deleteLog(logId);
      
    } catch (error) {
      console.error('Log deletion error:', error);
    }
  }, []);

  const clearLogs = useCallback(async () => {
    try {
      await db.clearLogs();
      updateFilters({ project: null, bookmark: false });
      setProjects([]);
    } catch (error) {
      console.error('Log clearing error:', error);
    }
  }, []);

  const toggleLogSelection = useCallback((logId) => {
    setSelectedLogs(prev => {
      if (prev.includes(logId)) return prev.filter(id => id !== logId);
      return prev.length < 2 ? [...prev, logId] : prev;
    });
  }, []);

  const toggleBookmark = useCallback(async (log) => {
    try {
      const newBookmarks = new Set([...bookmarkedLogs]);
      const hasBookmark = newBookmarks.has(log.id);
      
      if (hasBookmark) {
        newBookmarks.delete(log.id);
        await db.removeBookmark(log.id);
      } else {
        newBookmarks.add(log.id);
        await db.addBookmark(log.id);
      }
      
      setBookmarkedLogs(newBookmarks);
    } catch (error) {
      console.error('Bookmark operation error:', error);
    }
  }, [bookmarkedLogs]);

  const totalLogsCount = useMemo(() => {
    if (!logs) return 0;
    
    let count = [...logs];
    
    if (filters.bookmark) {
      count = count.filter(log => bookmarkedLogs.has(log.id));
    }
    
    count = count.filter(log => filters.levels.has(log.level.toLowerCase()));
    
    if (filters.project) {
      count = count.filter(log => log.project === filters.project);
    }
    
    return count.length;
  }, [logs, bookmarkedLogs, filters]);

  const startComparison = useCallback(() => {
    console.log("loggs",selectedLogs.length);
    if (selectedLogs.length === 2) {
      if (logs.some(log => selectedLogs.includes(log.id))) {
        setIsComparing(true);
      }
    }
  }, [selectedLogs]);

  const cancelComparison = useCallback(() => {
    setSelectedLogs([]);
    setIsComparing(false);
  }, []);

  const value = {
    logs,
    projects,
    selectedProject: filters.project,
    toggleLogSelection,
    selectedLogs,
    setSelectedLogs,
    isComparing,
    setIsComparing,
    bookmarkedLogs,
    selectedLevels: filters.levels,
    darkMode,
    setDarkMode,
    showBookmarksOnly: filters.bookmark,
    deleteLog,
    toggleBookmark,
    clearLogs,
    filters,
    updateFilters,
    startComparison,
    cancelComparison,
    totalLogsCount
  };

  return (
    <LogContext.Provider value={value}>
      {children}
    </LogContext.Provider>
  );
};

export const useLog = () => {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error('useLog must be used within a LogProvider');
  }
  return context;
};