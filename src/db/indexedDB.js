const DB_NAME = 'xrayLogsDB';
const DB_VERSION = 1;

export const initDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains('logs')) {
        const logsStore = db.createObjectStore('logs', { keyPath: 'id' });
        logsStore.createIndex('project', 'project', { unique: false });
        logsStore.createIndex('timestamp', 'timestamp', { unique: false });
      }

      if (!db.objectStoreNames.contains('bookmarks')) {
        db.createObjectStore('bookmarks', { keyPath: 'logId' });
      }
    };
  });
};

export const getLogs = (db) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['logs'], 'readonly');
    const store = transaction.objectStore('logs');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const getAllProjects = async (db) => {
  try {
    const logs = await getLogs(db);
    return [...new Set(logs.map(log => log.project))];
  } catch (error) {
    console.error('Error getting projects:', error);
    return [];
  }
};

export const addLog = (db, log) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['logs'], 'readwrite');
    const store = transaction.objectStore('logs');
    const request = store.add(log);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const deleteLog = (db, logId) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['logs', 'bookmarks'], 'readwrite');
    const logsStore = transaction.objectStore('logs');
    const bookmarksStore = transaction.objectStore('bookmarks');

    const deleteLogRequest = logsStore.delete(logId);
    const deleteBookmarkRequest = bookmarksStore.delete(logId);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

export const clearLogs = (db) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['logs', 'bookmarks'], 'readwrite');
    const logsStore = transaction.objectStore('logs');
    const bookmarksStore = transaction.objectStore('bookmarks');

    const clearLogsRequest = logsStore.clear();
    const clearBookmarksRequest = bookmarksStore.clear();

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });
};

export const addBookmark = (db, logId) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['bookmarks'], 'readwrite');
    const store = transaction.objectStore('bookmarks');
    const request = store.add({ logId });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const removeBookmark = (db, logId) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['bookmarks'], 'readwrite');
    const store = transaction.objectStore('bookmarks');
    const request = store.delete(logId);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};

export const getBookmarks = (db) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['bookmarks'], 'readonly');
    const store = transaction.objectStore('bookmarks');
    const request = store.getAllKeys();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};
