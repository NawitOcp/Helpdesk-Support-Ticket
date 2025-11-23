/**
 * File-based Datastore
 * 
 * Stores tickets in a JSON file.
 * Handles file creation, reading, and writing with proper error handling.
 */

import fs from 'fs/promises';
import path from 'path';

// ======================
// FileStore Class
// ======================

export class FileStore {
  constructor(filePath) {
    this.filePath = filePath;
    this.initialized = false;
  }

  /**
   * Initialize the datastore
   * Creates file and directory if they don't exist
   */
  async init() {
    if (this.initialized) return;

    try {
      // Ensure directory exists
      const dir = path.dirname(this.filePath);
      await fs.mkdir(dir, { recursive: true });

      // Check if file exists
      try {
        await fs.access(this.filePath);
        // Validate file content
        const content = await fs.readFile(this.filePath, 'utf-8');
        if (!content.trim()) {
          await this.writeData([]);
        } else {
          // Validate JSON
          JSON.parse(content);
        }
      } catch (err) {
        if (err.code === 'ENOENT') {
          // File doesn't exist, create it
          await this.writeData([]);
        } else if (err instanceof SyntaxError) {
          // Invalid JSON, reset file
          console.warn('Invalid JSON in data file. Resetting...');
          await this.writeData([]);
        } else {
          throw err;
        }
      }

      this.initialized = true;
      console.log(`📁 FileStore initialized: ${this.filePath}`);
    } catch (err) {
      console.error('Failed to initialize FileStore:', err);
      throw err;
    }
  }

  /**
   * Read all data from file
   */
  async readData() {
    await this.init();

    try {
      const content = await fs.readFile(this.filePath, 'utf-8');
      const data = JSON.parse(content || '[]');
      return Array.isArray(data) ? data : [];
    } catch (err) {
      if (err.code === 'ENOENT') {
        return [];
      }
      console.error('Error reading data file:', err);
      throw err;
    }
  }

  /**
   * Write all data to file
   */
  async writeData(data) {
    try {
      const content = JSON.stringify(data, null, 2);
      await fs.writeFile(this.filePath, content, 'utf-8');
    } catch (err) {
      console.error('Error writing data file:', err);
      throw err;
    }
  }

  // ======================
  // CRUD Operations
  // ======================

  /**
   * Find all tickets
   */
  async findAll() {
    return await this.readData();
  }

  /**
   * Find ticket by ID
   */
  async findById(id) {
    const tickets = await this.readData();
    return tickets.find(t => t.id === id) || null;
  }

  /**
   * Create a new ticket
   */
  async create(ticket) {
    const tickets = await this.readData();
    tickets.push(ticket);
    await this.writeData(tickets);
    return ticket;
  }

  /**
   * Update an existing ticket
   */
  async update(id, updates) {
    const tickets = await this.readData();
    const index = tickets.findIndex(t => t.id === id);

    if (index === -1) {
      return null;
    }

    tickets[index] = { ...tickets[index], ...updates };
    await this.writeData(tickets);
    return tickets[index];
  }

  /**
   * Check if ticket exists
   */
  async exists(id) {
    const ticket = await this.findById(id);
    return ticket !== null;
  }

  /**
   * Get total count
   */
  async count() {
    const tickets = await this.readData();
    return tickets.length;
  }

  /**
   * Clear all data (useful for testing)
   */
  async clear() {
    await this.writeData([]);
  }
}

// ======================
// Factory Function
// ======================

let instance = null;

export const createFileStore = (filePath) => {
  if (!instance) {
    instance = new FileStore(filePath);
  }
  return instance;
};

export const getFileStore = () => {
  if (!instance) {
    throw new Error('FileStore not initialized. Call createFileStore() first.');
  }
  return instance;
};

export default FileStore;