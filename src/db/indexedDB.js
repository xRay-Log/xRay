import { DB_CONSTANTS } from '../constants';

const { DB_NAME, DB_VERSION, STORES } = DB_CONSTANTS;

const createTransaction = (db, storeNames, mode = 'readonly') => {
  const transaction = db.transaction(storeNames, mode);
  return {
    transaction,
    stores: storeNames.reduce((acc, storeName) => ({
      ...acc,
      [storeName]: transaction.objectStore(storeName)
    }), {})
  };
};

const handleRequest = (request) => new Promise((resolve, reject) => {
  request.onerror = () => reject(request.error);
  request.onsuccess = () => resolve(request.result);
});

export const initDB = () => new Promise((resolve, reject) => {
  const request = indexedDB.open(DB_NAME, DB_VERSION);

  request.onerror = () => reject(request.error);
  request.onsuccess = () => resolve(request.result);

  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    const stores = [
      { name: STORES.LOGS, options: { keyPath: 'id' } },
      { name: STORES.BOOKMARKS, options: { keyPath: 'logId' } }
    ];

    stores.forEach(({ name, options }) => {
      if (!db.objectStoreNames.contains(name)) {
        db.createObjectStore(name, options);
      }
    });
  };
});

export const addLog = async (db, log) => {
  const { stores } = createTransaction(db, [STORES.LOGS], 'readwrite');
  return handleRequest(stores[STORES.LOGS].add(log));
};

export const getLogs = async (db) => {
  const { stores } = createTransaction(db, [STORES.LOGS]);
  return handleRequest(stores[STORES.LOGS].getAll());
};

export const deleteLog = (db, logId) => new Promise((resolve, reject) => {
  const { transaction, stores } = createTransaction(
    db, 
    [STORES.LOGS, STORES.BOOKMARKS], 
    'readwrite'
  );

  const requests = [
    stores[STORES.LOGS].delete(logId),
    stores[STORES.BOOKMARKS].delete(logId)
  ];

  requests.forEach(request => {
    request.onerror = () => reject(request.error);
  });

  transaction.oncomplete = () => resolve();
});

export const clearLogs = (db) => new Promise((resolve, reject) => {
  const { transaction, stores } = createTransaction(
    db, 
    [STORES.LOGS, STORES.BOOKMARKS], 
    'readwrite'
  );

  const requests = [
    stores[STORES.LOGS].clear(),
    stores[STORES.BOOKMARKS].clear()
  ];

  requests.forEach(request => {
    request.onerror = () => reject(request.error);
  });

  transaction.oncomplete = () => resolve();
});

export const getAllProjects = async (db) => {
  const logs = await getLogs(db);
  return [...new Set(logs.map(log => log.project))];
};

export const getLogsByProject = async (db, project) => {
  const logs = await getLogs(db);
  return logs.filter(log => log.project === project);
};

export const addBookmark = async (db, logId) => {
  const { stores } = createTransaction(db, [STORES.BOOKMARKS], 'readwrite');
  return handleRequest(stores[STORES.BOOKMARKS].add({ logId }));
};

export const removeBookmark = async (db, logId) => {
  const { stores } = createTransaction(db, [STORES.BOOKMARKS], 'readwrite');
  return handleRequest(stores[STORES.BOOKMARKS].delete(logId));
};

export const getBookmarks = async (db) => {
  const { stores } = createTransaction(db, [STORES.BOOKMARKS]);
  const bookmarks = await handleRequest(stores[STORES.BOOKMARKS].getAll());
  return bookmarks.map(bookmark => bookmark.logId);
};
