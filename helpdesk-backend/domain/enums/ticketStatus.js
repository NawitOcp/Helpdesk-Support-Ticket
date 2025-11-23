/**
 * Ticket Status Enum & Helpers
 * 
 * Central definition of all ticket statuses and their relationships.
 */

// ======================
// Status Enum
// ======================

export const TicketStatus = Object.freeze({
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    RESOLVED: 'resolved',
    REJECTED: 'rejected'
  });
  
  // ======================
  // Status Collections
  // ======================
  
  /** All valid status values */
  export const ALL_STATUSES = Object.freeze(Object.values(TicketStatus));
  
  /** Statuses that can still be modified */
  export const ACTIVE_STATUSES = Object.freeze([
    TicketStatus.PENDING,
    TicketStatus.ACCEPTED
  ]);
  
  /** Final statuses (no further transitions allowed) */
  export const FINAL_STATUSES = Object.freeze([
    TicketStatus.RESOLVED,
    TicketStatus.REJECTED
  ]);
  
  // ======================
  // Status Transitions
  // ======================
  
  export const STATUS_TRANSITIONS = Object.freeze({
    [TicketStatus.PENDING]: [TicketStatus.ACCEPTED, TicketStatus.REJECTED],
    [TicketStatus.ACCEPTED]: [TicketStatus.RESOLVED, TicketStatus.REJECTED],
    [TicketStatus.RESOLVED]: [],
    [TicketStatus.REJECTED]: []
  });
  
  /** Sort order for status-based sorting */
  export const STATUS_SORT_ORDER = Object.freeze({
    [TicketStatus.PENDING]: 0,
    [TicketStatus.ACCEPTED]: 1,
    [TicketStatus.RESOLVED]: 2,
    [TicketStatus.REJECTED]: 3
  });
  
  // ======================
  // Helper Functions
  // ======================
  
  /**
   * Check if a value is a valid status
   */
  export const isValidStatus = (status) => {
    return ALL_STATUSES.includes(status);
  };
  
  /**
   * Check if status is a final state
   */
  export const isFinalStatus = (status) => {
    return FINAL_STATUSES.includes(status);
  };
  
  /**
   * Check if status is active (can be modified)
   */
  export const isActiveStatus = (status) => {
    return ACTIVE_STATUSES.includes(status);
  };
  
  /**
   * Check if transition from one status to another is valid
   */
  export const canTransition = (fromStatus, toStatus) => {
    const allowed = STATUS_TRANSITIONS[fromStatus];
    return allowed ? allowed.includes(toStatus) : false;
  };
  
  /**
   * Get allowed transitions for a status
   */
  export const getAllowedTransitions = (status) => {
    return STATUS_TRANSITIONS[status] || [];
  };
  
  /**
   * Get sort order value for a status
   */
  export const getStatusSortOrder = (status) => {
    return STATUS_SORT_ORDER[status] ?? 999;
  };
  
  /**
   * Compare two statuses for sorting
   */
  export const compareStatus = (a, b, order = 'asc') => {
    const diff = getStatusSortOrder(a) - getStatusSortOrder(b);
    return order === 'asc' ? diff : -diff;
  };