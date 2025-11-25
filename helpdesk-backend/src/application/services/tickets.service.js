import { v4 as uuidv4 } from 'uuid';
import * as ticketRepository from '../../infrastructure/repositories/tickets.repository.js';
import { AppError } from '../errors/AppError.js';

// ======================
// Status Transition Rules
// ======================

const VALID_TRANSITIONS = {
  pending: ['accepted', 'rejected'],
  accepted: ['resolved', 'rejected'],
  resolved: [],  // final state
  rejected: []   // final state
};

const STATUS_ORDER = ['pending', 'accepted', 'resolved', 'rejected'];

// ======================
// Service Functions
// ======================

/**
 * List tickets with filtering, sorting, and pagination
 */
export const listTickets = async (query) => {
  const { status, sortBy, sortOrder, page, limit } = query;

  // Get all tickets
  let tickets = await ticketRepository.findAll();

  // Filter by status
  if (status) {
    const statuses = Array.isArray(status) ? status : status.split(',');
    tickets = tickets.filter(t => statuses.includes(t.status));
  }

  // Sort tickets
  tickets = sortTickets(tickets, sortBy, sortOrder);

  // Pagination
  const total = tickets.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginatedTickets = tickets.slice(offset, offset + limit);

  return {
    tickets: paginatedTickets,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
};

/**
 * Get a single ticket by ID
 */
export const getTicketById = async (id) => {
  return await ticketRepository.findById(id);
};

/**
 * Create a new ticket
 */
export const createTicket = async (input) => {
  const { title, description, contact } = input;

  // Validate required fields
  if (!title || !title.trim()) {
    throw new AppError('VALIDATION_ERROR', 'Title is required', 400);
  }
  if (!description || !description.trim()) {
    throw new AppError('VALIDATION_ERROR', 'Description is required', 400);
  }

  const now = new Date().toISOString();

  const ticket = {
    id: uuidv4(),
    title: title.trim(),
    description: description.trim(),
    contact: {
      name: contact?.name?.trim() || '',
      email: contact?.email?.trim() || '',
      phone: contact?.phone?.trim() || null
    },
    status: 'pending',
    createdAt: now,
    updatedAt: now
  };

  return await ticketRepository.create(ticket);
};

/**
 * Update ticket information (not status)
 */
export const updateTicket = async (id, input) => {
  const ticket = await ticketRepository.findById(id);
  
  if (!ticket) {
    return null;
  }

  // Build update payload (exclude status)
  const updates = {};

  if (input.title !== undefined) {
    if (!input.title.trim()) {
      throw new AppError('VALIDATION_ERROR', 'Title cannot be empty', 400);
    }
    updates.title = input.title.trim();
  }

  if (input.description !== undefined) {
    if (!input.description.trim()) {
      throw new AppError('VALIDATION_ERROR', 'Description cannot be empty', 400);
    }
    updates.description = input.description.trim();
  }

  if (input.contact !== undefined) {
    updates.contact = {
      ...ticket.contact,
      ...input.contact
    };
  }

  // Always update timestamp
  updates.updatedAt = new Date().toISOString();

  return await ticketRepository.update(id, updates);
};

/**
 * Update ticket status with transition validation
 */
export const updateTicketStatus = async (id, newStatus) => {
  const ticket = await ticketRepository.findById(id);
  
  if (!ticket) {
    return null;
  }

  const currentStatus = ticket.status;

  // Validate new status is valid
  if (!STATUS_ORDER.includes(newStatus)) {
    throw new AppError(
      'INVALID_STATUS',
      `Invalid status '${newStatus}'. Valid statuses: ${STATUS_ORDER.join(', ')}`,
      400
    );
  }

  // Check if transition is allowed
  const allowedTransitions = VALID_TRANSITIONS[currentStatus];
  
  if (!allowedTransitions.includes(newStatus)) {
    throw new AppError(
      'INVALID_STATUS_TRANSITION',
      `Cannot transition from '${currentStatus}' to '${newStatus}'. Allowed: ${allowedTransitions.length ? allowedTransitions.join(', ') : 'none (final state)'}`,
      422
    );
  }

  const updates = {
    status: newStatus,
    updatedAt: new Date().toISOString()
  };

  return await ticketRepository.update(id, updates);
};

// ======================
// Helper Functions
// ======================

/**
 * Sort tickets by specified field and order
 */
const sortTickets = (tickets, sortBy, sortOrder) => {
  const order = sortOrder === 'asc' ? 1 : -1;

  return [...tickets].sort((a, b) => {
    if (sortBy === 'status') {
      return (STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status)) * order;
    }
    
    if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      return (new Date(a[sortBy]) - new Date(b[sortBy])) * order;
    }

    // Default: sort by updatedAt desc
    return (new Date(b.updatedAt) - new Date(a.updatedAt));
  });
};