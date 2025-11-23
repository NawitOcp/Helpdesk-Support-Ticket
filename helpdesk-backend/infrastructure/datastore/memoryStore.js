/**
 * In-Memory Datastore
 * 
 * Stores tickets in memory (array).
 * Useful for development and testing.
 * Data is lost when the process restarts.
 * 
 * API matches FileStore for easy swapping.
 */

// ======================
// MemoryStore Class
// ======================

export class MemoryStore {
    constructor() {
      this.tickets = [];
      this.initialized = false;
    }
  
    /**
     * Initialize the datastore
     */
    async init() {
      if (this.initialized) return;
      this.tickets = [];
      this.initialized = true;
      console.log('💾 MemoryStore initialized');
    }
  
    // ======================
    // CRUD Operations
    // ======================
  
    /**
     * Find all tickets
     */
    async findAll() {
      return [...this.tickets];
    }
  
    /**
     * Find ticket by ID
     */
    async findById(id) {
      const ticket = this.tickets.find(t => t.id === id);
      return ticket ? { ...ticket } : null;
    }
  
    /**
     * Create a new ticket
     */
    async create(ticket) {
      const newTicket = { ...ticket };
      this.tickets.push(newTicket);
      return { ...newTicket };
    }
  
    /**
     * Update an existing ticket
     */
    async update(id, updates) {
      const index = this.tickets.findIndex(t => t.id === id);
  
      if (index === -1) {
        return null;
      }
  
      this.tickets[index] = { ...this.tickets[index], ...updates };
      return { ...this.tickets[index] };
    }
  
    /**
     * Check if ticket exists
     */
    async exists(id) {
      return this.tickets.some(t => t.id === id);
    }
  
    /**
     * Get total count
     */
    async count() {
      return this.tickets.length;
    }
  
    /**
     * Clear all data
     */
    async clear() {
      this.tickets = [];
    }
  
    /**
     * Seed with initial data (useful for testing/demo)
     */
    async seed(data) {
      this.tickets = [...data];
    }
  }
  
  // ======================
  // Factory Function
  // ======================
  
  let instance = null;
  
  export const createMemoryStore = () => {
    if (!instance) {
      instance = new MemoryStore();
    }
    return instance;
  };
  
  export const getMemoryStore = () => {
    if (!instance) {
      throw new Error('MemoryStore not initialized. Call createMemoryStore() first.');
    }
    return instance;
  };
  
  /**
   * Reset instance (useful for testing)
   */
  export const resetMemoryStore = () => {
    if (instance) {
      instance.tickets = [];
    }
    instance = null;
  };
  
  export default MemoryStore;