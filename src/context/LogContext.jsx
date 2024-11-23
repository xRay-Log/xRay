import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { listen } from '@tauri-apps/api/event';
import * as db from '../db/indexedDB';
import { LOG_LEVELS } from '../constants';

const LogContext = createContext(null);

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
  message: atob(data.payload),
  trace: data.trace || null
});

const useDatabase = (setLogs, setProjects, setBookmarkedLogs) => {
  const [dbInstance, setDbInstance] = useState(null);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const database = await db.initDB();
        setDbInstance(database);

        const [storedLogs, projectList, bookmarks] = await Promise.all([
          db.getLogs(database),
          db.getAllProjects(database),
          db.getBookmarks(database)
        ]);

        setLogs(storedLogs);
        setProjects(projectList);
        setBookmarkedLogs(new Set(bookmarks));
      } catch (error) {
        console.error('Database initialization error:', error);
      }
    };

    initializeDatabase();
  }, [setLogs, setProjects, setBookmarkedLogs]);

  return dbInstance;
};

const useLogListener = (dbInstance, setLogs, setProjects) => {
  useEffect(() => {
    if (!dbInstance) return;

    let unlistenFn;
    const setupLogListener = async () => {
      try {
        unlistenFn = await listen('log', async (event) => {
          try {
            const logData = processLogData(JSON.parse(event.payload));
            await db.addLog(dbInstance, logData);
            
            setLogs(prevLogs => [logData, ...prevLogs]);
            setProjects(prevProjects => 
              prevProjects.includes(logData.project) 
                ? prevProjects 
                : [...prevProjects, logData.project]
            );
          } catch (error) {
            console.error('Log processing error:', error);
          }
        });
      } catch (error) {
        console.error('Log listener setup error:', error);
      }
    };

    setupLogListener();
    return () => unlistenFn?.();
  }, [dbInstance, setLogs, setProjects]);
};

const useThemeEffect = (darkMode) => {
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);
};

export const LogProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedLogs, setSelectedLogs] = useState([]);
  const [isComparing, setIsComparing] = useState(false);
  const [bookmarkedLogs, setBookmarkedLogs] = useState(new Set());
  const [selectedLevels, setSelectedLevels] = useState(
    new Set(LOG_LEVELS.map(({ level }) => level))
  );
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);

  const dbInstance = useDatabase(setLogs, setProjects, setBookmarkedLogs);
  useLogListener(dbInstance, setLogs, setProjects);
  useThemeEffect(darkMode);

  const deleteLog = useCallback(async (logId) => {
    if (!dbInstance) return;

    try {
      await db.deleteLog(dbInstance, logId);
      setLogs(prev => {
        const updated = prev.filter(log => log.id !== logId);
        setProjects([...new Set(updated.map(log => log.project))]);
        return updated;
      });
    } catch (error) {
      console.error('Log deletion error:', error);
    }
  }, [dbInstance]);

  const clearLogs = useCallback(async () => {
    if (!dbInstance) return;

    try {
      await db.clearLogs(dbInstance);
      setLogs([]);
      setProjects([]);
    } catch (error) {
      console.error('Log clearing error:', error);
    }
  }, [dbInstance]);

  const toggleLogSelection = useCallback((logId) => {
    setSelectedLogs(prev => {
      if (prev.includes(logId)) return prev.filter(id => id !== logId);
      return prev.length < 2 ? [...prev, logId] : prev;
    });
  }, []);

  const toggleBookmark = useCallback(async (log) => {
    if (!dbInstance) return;

    try {
      const newBookmarks = new Set(bookmarkedLogs);
      const hasBookmark = newBookmarks.has(log.id);
      
      if (hasBookmark) {
        newBookmarks.delete(log.id);
        await db.removeBookmark(dbInstance, log.id);
      } else {
        newBookmarks.add(log.id);
        await db.addBookmark(dbInstance, log.id);
      }
      
      setBookmarkedLogs(newBookmarks);
    } catch (error) {
      console.error('Bookmark operation error:', error);
    }
  }, [dbInstance, bookmarkedLogs]);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const levelMatch = selectedLevels.has(log.level.toLowerCase());
      const projectMatch = !selectedProject || log.project === selectedProject;
      const bookmarkMatch = !showBookmarksOnly || bookmarkedLogs.has(log.id);
      return levelMatch && projectMatch && bookmarkMatch;
    });
  }, [logs, selectedLevels, selectedProject, showBookmarksOnly, bookmarkedLogs]);

  const startComparison = useCallback(() => {
    if (selectedLogs.length === 2) setIsComparing(true);
  }, [selectedLogs]);

  const cancelComparison = useCallback(() => {
    setSelectedLogs([]);
    setIsComparing(false);
  }, []);

  const contextValue = useMemo(() => ({
    logs: filteredLogs,
    allLogs: logs,
    projects,
    selectedProject,
    setSelectedProject,
    deleteLog,
    clearLogs,
    darkMode,
    setDarkMode,
    selectedLogs,
    toggleLogSelection,
    startComparison,
    cancelComparison,
    isComparing,
    bookmarkedLogs,
    toggleBookmark,
    selectedLevels,
    setSelectedLevels,
    showBookmarksOnly,
    setShowBookmarksOnly
  }), [
    filteredLogs, logs, projects, selectedProject, deleteLog, 
    clearLogs, darkMode, selectedLogs, toggleLogSelection, 
    startComparison, cancelComparison, isComparing, 
    bookmarkedLogs, toggleBookmark, selectedLevels,
    showBookmarksOnly
  ]);

  return (
    <LogContext.Provider value={contextValue}>
      {children}
    </LogContext.Provider>
  );
};

export const useLog = () => {
  const context = useContext(LogContext);
  if (!context) {
    throw new Error('useLog hook must be used within LogProvider');
  }
  return context;
};