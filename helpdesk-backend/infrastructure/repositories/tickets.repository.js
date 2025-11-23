/**
 * Tickets Repository
 * 
 * Data access layer for tickets. Handles all CRUD operations
 * and delegates to the configured datastore.
 * 
 * NO business logic here - only data operations.
 */

import { getDatastore } from '../datastore/index.js';

// ======================
// Repository Functions
// ======================

/**
 * Find a ticket by ID
 * @param {string} id - Ticket ID
 * @returns {Promise<object|null>} Ticket data or null if not found
 */
export const findById = async (id) => {
  const datastore = getDatastore();
  return await datastore.findById(id);
};

/**
 * Find all tickets (with optional criteria)
 * @param {object} criteria - Optional filter/sort criteria
 * @returns {Promise<object[]>} Array of tickets
 */
export const findAll = async (criteria = {}) => {
  const datastore = getDatastore();
  let tickets = await datastore.findAll();

  // Apply filtering
  if (criteria.status) {
    const statuses = Array.isArray(criteria.status) 
      ? criteria.status 
      : [criteria.status];
    tickets = tickets.filter(t => statuses.includes(t.status));
  }

  // Apply sorting
  if (criteria.sortBy) {
    tickets = sortTickets(tickets, criteria.sortBy, criteria.sortOrder);
  }

  // Apply pagination
  if (criteria.page && criteria.limit) {
    const offset = (criteria.page - 1) * criteria.limit;
    return {
      data: tickets.slice(offset, offset + criteria.limit),
      total: tickets.length
    };
  }

  return { data: tickets, total: tickets.length };
};

/**
 * Create a new ticket
 * @param {object} ticket - Ticket data to create
 * @returns {Promise<object>} Created ticket
 */
export const create = async (ticket) => {
  const datastore = getDatastore();
  return await datastore.create(ticket);
};

/**
 * Update an existing ticket
 * @param {string} id - Ticket ID
 * @param {object} updates - Fields to update
 * @returns {Promise<object|null>} Updated ticket or null if not found
 */
export const update = async (id, updates) => {
  const datastore = getDatastore();
  return await datastore.update(id, updates);
};

/**
 * Check if a ticket exists
 * @param {string} id - Ticket ID
 * @returns {Promise<boolean>}
 */
export const exists = async (id) => {
  const ticket = await findById(id);
  return ticket !== null;
};

/**
 * Count tickets (with optional filter)
 * @param {object} filter - Optional status filter
 * @returns {Promise<number>}
 */
export const count = async (filter = {}) => {
  const datastore = getDatastore();
  let tickets = await datastore.findAll();

  if (filter.status) {
    const statuses = Array.isArray(filter.status) 
      ? filter.status 
      : [filter.status];
    tickets = tickets.filter(t => statuses.includes(t.status));
  }

  return tickets.length;
};

// ======================
// Helper Functions
// ======================

const STATUS_ORDER = ['pending', 'accepted', 'resolved', 'rejected'];

/**
 * Sort tickets by field
 */
const sortTickets = (tickets, sortBy, sortOrder = 'desc') => {
  const order = sortOrder === 'asc' ? 1 : -1;

  return [...tickets].sort((a, b) => {
    if (sortBy === 'status') {
      return (STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status)) * order;
    }

    if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      return (new Date(a[sortBy]) - new Date(b[sortBy])) * order;
    }

    return 0;
  });
};