import Dexie from 'dexie';

class XRayDatabase extends Dexie {
  constructor() {
    super('xRayDB');
    
    this.version(1).stores({
      logs: '++id, project, level, timestamp',
      bookmarks: 'logId'
    });
    
    this.logs = this.table('logs');
    this.bookmarks = this.table('bookmarks');
  }

  async init() {
    try {
      await this.open();
      return this;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  async getProjectCounts() {
    const projects = {};
    await this.logs.orderBy('project').each(log => {
      projects[log.project] = (projects[log.project] || 0) + 1;
    });
    return projects;
  }

  async getTotalLogsCount() {
    return await this.logs.count();
  }

  async getBookmarksCount() {
    return await this.bookmarks.count();
  }

  liveTotalLogsCount() {
    return this.logs.count();
  }

  liveProjectCounts() {
    return this.logs.toArray().then(logs => {
      const counts = {};
      for (const log of logs) {
        counts[log.project] = (counts[log.project] || 0) + 1;
      }
      return counts;
    });
  }

  liveBookmarksCount() {
    return this.bookmarks.count();
  }

  async getFilteredLogs(selectedLevels, selectedProject) {
    let collection = this.logs.orderBy('timestamp').reverse();
    
    if (selectedProject) {
      collection = collection.filter(log => log.project === selectedProject);
    }
    
    if (selectedLevels && selectedLevels.size > 0) {
      collection = collection.filter(log => selectedLevels.has(log.level));
    }
    
    return await collection.toArray();
  }

  async liveFilteredLogs(filters) {
    try {
      let collection = this.logs.orderBy('timestamp').reverse();
      
      if (filters.bookmark) {
        const bookmarks = await this.bookmarks.toArray();
        const bookmarkIds = new Set(bookmarks.map(b => b.logId));
        collection = collection.filter(log => bookmarkIds.has(log.id));
      }
      
      if (filters.project) {
        collection = collection.filter(log => log.project === filters.project);
      }
      
      if (filters.levels && filters.levels.size > 0) {
        collection = collection.filter(log => filters.levels.has(log.level));
      }
      
      return await collection.toArray();
    } catch (error) {
      console.error('Failed to get filtered logs:', error);
      return [];
    }
  }

  async addLog(log) {
    try {
      await this.logs.add(log);
    } catch (error) {
      console.error('Failed to add log:', error);
      throw error;
    }
  }

  async getLogs() {
    try {
      return await this.logs.orderBy('timestamp').reverse().toArray();
    } catch (error) {
      console.error('Failed to get logs:', error);
      throw error;
    }
  }

  async deleteLog(logId) {
    try {
      await this.logs.delete(logId);
      await this.bookmarks.delete(logId);
    } catch (error) {
      console.error('Failed to delete log:', error);
      throw error;
    }
  }

  async clearLogs() {
    try {
      await this.logs.clear();
      await this.bookmarks.clear();
    } catch (error) {
      console.error('Failed to clear logs:', error);
      throw error;
    }
  }

  async addBookmark(logId) {
    try {
      await this.bookmarks.put({ logId });
    } catch (error) {
      console.error('Failed to add bookmark:', error);
      throw error;
    }
  }

  async removeBookmark(logId) {
    try {
      await this.bookmarks.where('logId').equals(logId).delete();
    } catch (error) {
      console.error('Failed to remove bookmark:', error);
      throw error;
    }
  }

  async getBookmarks() {
    try {
      const bookmarks = await this.bookmarks.toArray();
      const bookmarkIds = bookmarks.map(b => b.logId);
      return bookmarkIds;
    } catch (error) {
      console.error('Failed to get bookmarks:', error);
      throw error;
    }
  }

  async getAllProjects() {
    try {
      const logs = await this.logs.toArray();
      return [...new Set(logs.map(log => log.project))];
    } catch (error) {
      console.error('Failed to get projects:', error);
      throw error;
    }
  }
}

const db = new XRayDatabase();

export { db };
