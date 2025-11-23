/**
 * Ticket Domain Model
 * 
 * Defines the structure, behavior, and business rules for a Ticket entity.
 * This is the core domain representation - independent of HTTP or persistence.
 */

import { v4 as uuidv4 } from 'uuid';

// ======================
// Constants
// ======================

export const TicketStatus = Object.freeze({
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  RESOLVED: 'resolved',
  REJECTED: 'rejected'
});

export const STATUS_TRANSITIONS = Object.freeze({
  [TicketStatus.PENDING]: [TicketStatus.ACCEPTED, TicketStatus.REJECTED],
  [TicketStatus.ACCEPTED]: [TicketStatus.RESOLVED, TicketStatus.REJECTED],
  [TicketStatus.RESOLVED]: [],  // final state
  [TicketStatus.REJECTED]: []   // final state
});

// ======================
// Ticket Class
// ======================

export class Ticket {
  constructor({ id, title, description, contact, status, createdAt, updatedAt }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.contact = contact;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  /**
   * Check if ticket is in a final state
   */
  isFinalState() {
    return STATUS_TRANSITIONS[this.status].length === 0;
  }

  /**
   * Check if transition to new status is allowed
   */
  canTransitionTo(newStatus) {
    return STATUS_TRANSITIONS[this.status]?.includes(newStatus) ?? false;
  }

  /**
   * Get allowed transitions from current status
   */
  getAllowedTransitions() {
    return STATUS_TRANSITIONS[this.status] || [];
  }

  /**
   * Convert to plain object (for persistence/API response)
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      contact: { ...this.contact },
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  /**
   * Create a copy with updated fields
   */
  copyWith(updates) {
    return new Ticket({
      ...this.toJSON(),
      ...updates,
      updatedAt: new Date().toISOString()
    });
  }
}

// ======================
// Factory Functions
// ======================

/**
 * Create a new Ticket with auto-generated fields
 */
export const createTicket = ({ title, description, contact }) => {
  const now = new Date().toISOString();

  return new Ticket({
    id: uuidv4(),
    title: title.trim(),
    description: description.trim(),
    contact: {
      name: contact?.name?.trim() || '',
      email: contact?.email?.trim() || '',
      phone: contact?.phone?.trim() || null
    },
    status: TicketStatus.PENDING,
    createdAt: now,
    updatedAt: now
  });
};

/**
 * Reconstruct a Ticket from stored data
 */
export const fromData = (data) => {
  return new Ticket({
    id: data.id,
    title: data.title,
    description: data.description,
    contact: {
      name: data.contact?.name || '',
      email: data.contact?.email || '',
      phone: data.contact?.phone || null
    },
    status: data.status,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  });
};

// ======================
// Domain Schema (for reference)
// ======================

/**
 * @typedef {Object} Contact
 * @property {string} name - Contact person's name
 * @property {string} email - Contact email address
 * @property {string|null} phone - Optional phone number
 */

/**
 * @typedef {Object} TicketData
 * @property {string} id - Unique identifier (UUID)
 * @property {string} title - Ticket title (max 255 chars)
 * @property {string} description - Ticket description (max 2000 chars)
 * @property {Contact} contact - Contact information
 * @property {'pending'|'accepted'|'resolved'|'rejected'} status - Current status
 * @property {string} createdAt - ISO timestamp of creation
 * @property {string} updatedAt - ISO timestamp of last update
 */