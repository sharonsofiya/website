const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const config = require('../config/env');
const seedData = require('./seedData');

/**
 * Base Abstract Repository / Adapter
 */
class BaseDatabaseAdapter {
  async init() { throw new Error('Not implemented'); }
  async get(collection, filterFn) { throw new Error('Not implemented'); }
  async getById(collection, id) { throw new Error('Not implemented'); }
  async create(collection, data) { throw new Error('Not implemented'); }
  async update(collection, id, data) { throw new Error('Not implemented'); }
  async delete(collection, id) { throw new Error('Not implemented'); }
  async getSingleton(key) { throw new Error('Not implemented'); }
  async setSingleton(key, data) { throw new Error('Not implemented'); }
  async resetToDefaults() { throw new Error('Not implemented'); }
}

/**
 * JSON File Database Adapter with Atomic Writes and In-Memory Cache
 */
class JsonFileAdapter extends BaseDatabaseAdapter {
  constructor(filePath) {
    super();
    this.filePath = filePath;
    this.data = null;
    this.initPromise = null;
  }

  async init() {
    if (this.initPromise) return this.initPromise;

    this.initPromise = (async () => {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(this.filePath)) {
        try {
          const raw = fs.readFileSync(this.filePath, 'utf-8');
          this.data = JSON.parse(raw);
          // Verify required collections exist
          this._ensureStructure();
        } catch (err) {
          console.warn('[Database] Corrupted db.json found, reinitializing with seed data:', err.message);
          this.data = JSON.parse(JSON.stringify(seedData));
          this._save();
        }
      } else {
        this.data = JSON.parse(JSON.stringify(seedData));
        this._save();
      }
      return this.data;
    })();

    return this.initPromise;
  }

  _ensureStructure() {
    let modified = false;
    for (const key of Object.keys(seedData)) {
      if (this.data[key] === undefined) {
        this.data[key] = JSON.parse(JSON.stringify(seedData[key]));
        modified = true;
      }
    }
    if (modified) {
      this._save();
    }
  }

  _save() {
    try {
      const tempPath = `${this.filePath}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempPath, this.filePath);
    } catch (err) {
      console.error('[Database] Failed to write db.json:', err.message);
    }
  }

  async get(collection, filterFn = null) {
    await this.init();
    const list = this.data[collection] || [];
    if (filterFn) {
      return list.filter(filterFn);
    }
    return [...list];
  }

  async getById(collection, id) {
    await this.init();
    const list = this.data[collection] || [];
    return list.find(item => String(item.id) === String(id)) || null;
  }

  async create(collection, item) {
    await this.init();
    if (!this.data[collection]) {
      this.data[collection] = [];
    }
    const newItem = {
      id: item.id || `${collection.slice(0, 4)}-${randomUUID().slice(0, 8)}`,
      createdAt: item.createdAt || new Date().toISOString(),
      ...item
    };
    this.data[collection].push(newItem);
    this._save();
    return newItem;
  }

  async update(collection, id, updates) {
    await this.init();
    const list = this.data[collection] || [];
    const index = list.findIndex(item => String(item.id) === String(id));
    if (index === -1) {
      return null;
    }
    const updatedItem = {
      ...list[index],
      ...updates,
      id: list[index].id, // Prevent overwriting primary ID
      updatedAt: new Date().toISOString()
    };
    list[index] = updatedItem;
    this._save();
    return updatedItem;
  }

  async delete(collection, id) {
    await this.init();
    const list = this.data[collection] || [];
    const index = list.findIndex(item => String(item.id) === String(id));
    if (index === -1) {
      return false;
    }
    list.splice(index, 1);
    this._save();
    return true;
  }

  async getSingleton(key) {
    await this.init();
    return this.data[key] || null;
  }

  async setSingleton(key, updates) {
    await this.init();
    const current = this.data[key] || {};
    this.data[key] = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this._save();
    return this.data[key];
  }

  async resetToDefaults() {
    this.data = JSON.parse(JSON.stringify(seedData));
    this._save();
    return true;
  }
}

/**
 * Memory Adapter for isolated testing
 */
class MemoryAdapter extends BaseDatabaseAdapter {
  constructor() {
    super();
    this.data = JSON.parse(JSON.stringify(seedData));
  }
  async init() { return this.data; }
  async get(collection, filterFn = null) {
    const list = this.data[collection] || [];
    return filterFn ? list.filter(filterFn) : [...list];
  }
  async getById(collection, id) {
    return (this.data[collection] || []).find(i => String(i.id) === String(id)) || null;
  }
  async create(collection, item) {
    if (!this.data[collection]) this.data[collection] = [];
    const newItem = { id: item.id || randomUUID(), ...item };
    this.data[collection].push(newItem);
    return newItem;
  }
  async update(collection, id, updates) {
    const list = this.data[collection] || [];
    const idx = list.findIndex(i => String(i.id) === String(id));
    if (idx === -1) return null;
    list[idx] = { ...list[idx], ...updates, id: list[idx].id };
    return list[idx];
  }
  async delete(collection, id) {
    const list = this.data[collection] || [];
    const idx = list.findIndex(i => String(i.id) === String(id));
    if (idx === -1) return false;
    list.splice(idx, 1);
    return true;
  }
  async getSingleton(key) { return this.data[key] || null; }
  async setSingleton(key, updates) {
    this.data[key] = { ...(this.data[key] || {}), ...updates };
    return this.data[key];
  }
  async resetToDefaults() {
    this.data = JSON.parse(JSON.stringify(seedData));
    return true;
  }
}

/**
 * Database Factory
 */
function createDatabaseAdapter() {
  switch (config.DB_TYPE) {
    case 'memory':
      return new MemoryAdapter();
    case 'file':
    default:
      return new JsonFileAdapter(config.DB_FILE_PATH);
  }
}

const db = createDatabaseAdapter();

// Initialize immediately
db.init().catch(err => {
  console.error('[Database Init Error]:', err);
});

module.exports = {
  db,
  BaseDatabaseAdapter,
  JsonFileAdapter,
  MemoryAdapter
};
