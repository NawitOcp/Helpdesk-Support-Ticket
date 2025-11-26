/**
 * Kanban Utility Functions
 * Helper functions for Kanban board operations
 */

// ======================
// Constants
// ======================

export const STATUS_TRANSITIONS = {
  pending: ["accepted", "rejected"],
  accepted: ["resolved", "rejected"],
  resolved: [],
  rejected: [],
};

export const COLUMN_CONFIG = {
  pending: {
    title: "Pending",
    color: "orange",
    bgColor: "bg-orange-500",
  },
  accepted: {
    title: "Accepted",
    color: "blue",
    bgColor: "bg-blue-500",
  },
  resolved: {
    title: "Resolved",
    color: "green",
    bgColor: "bg-green-600",
  },
  rejected: {
    title: "Rejected",
    color: "red",
    bgColor: "bg-red-600",
  },
};

// ======================
// Validation Functions
// ======================

/**
 * Check if status transition is valid
 */
export const isValidTransition = (fromStatus, toStatus) => {
  if (fromStatus === toStatus) return true;

  const allowedTransitions = STATUS_TRANSITIONS[fromStatus] || [];
  return allowedTransitions.includes(toStatus);
};

/**
 * Check if status is final (cannot be moved)
 */
export const isFinalStatus = (status) => {
  return STATUS_TRANSITIONS[status]?.length === 0;
};

/**
 * Get error message for invalid transition
 */
export const getTransitionErrorMessage = (fromStatus, toStatus) => {
  const allowedTransitions = STATUS_TRANSITIONS[fromStatus] || [];

  if (allowedTransitions.length === 0) {
    return `Cannot move ticket from '${fromStatus}' - it's a final state`;
  }

  return `Cannot move ticket from '${fromStatus}' to '${toStatus}'. Allowed transitions: ${allowedTransitions.join(
    ", "
  )}`;
};

// ======================
// Grouping & Sorting
// ======================

/**
 * Group tickets by status and sort by position
 */
export const groupTicketsByStatus = (tickets) => {
  const grouped = {
    pending: [],
    accepted: [],
    resolved: [],
    rejected: [],
  };

  tickets.forEach((ticket) => {
    if (grouped[ticket.status]) {
      grouped[ticket.status].push(ticket);
    }
  });

  // Sort each group by position
  Object.keys(grouped).forEach((status) => {
    grouped[status].sort((a, b) => (a.position || 0) - (b.position || 0));
  });

  return grouped;
};

// ======================
// Position Calculation
// ======================

/**
 * Calculate new position for ticket in column
 */
export const calculateNewPosition = (targetIndex, ticketsInColumn) => {
  if (ticketsInColumn.length === 0) {
    return 0;
  }

  if (targetIndex === 0) {
    const firstPosition = ticketsInColumn[0]?.position || 0;
    return Math.max(0, firstPosition - 1000);
  }

  if (targetIndex >= ticketsInColumn.length) {
    const lastPosition =
      ticketsInColumn[ticketsInColumn.length - 1]?.position || 0;
    return lastPosition + 1000;
  }

  const prevPosition = ticketsInColumn[targetIndex - 1]?.position || 0;
  const nextPosition = ticketsInColumn[targetIndex]?.position || prevPosition + 2000;

  return Math.floor((prevPosition + nextPosition) / 2);
};

/**
 * Reorder tickets within a column and recalculate positions
 */
export const reorderTicketsInColumn = (tickets, fromIndex, toIndex) => {
  const reordered = [...tickets];
  const [movedTicket] = reordered.splice(fromIndex, 1);
  reordered.splice(toIndex, 0, movedTicket);

  // Recalculate positions
  return reordered.map((ticket, index) => ({
    ...ticket,
    position: index * 1000,
  }));
};

// ======================
// Formatting Functions
// ======================

/**
 * Format date for display
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
};

/**
 * Format date with time
 */
export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return {
    date: date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    time: date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};