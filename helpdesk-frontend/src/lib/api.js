/**
 * API Client for Kanban Board Operations
 * 
 * Handles all HTTP requests related to tickets with proper error handling.
 * Base URL assumes /api prefix is configured in Vite proxy.
 */

const API_BASE_URL = '/api';

/**
 * Generic fetch wrapper with error handling
 * @param {string} url - API endpoint
 * @param {object} options - Fetch options
 * @returns {Promise<any>} - Response data
 * @throws {Error} - With user-friendly message
 */
const fetchWithErrorHandling = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    // Parse response
    const data = await response.json();

    // Handle HTTP errors
    if (!response.ok) {
      // Extract error message from response
      const errorMessage = data.message || data.error || `Request failed with status ${response.status}`;
      
      // Special handling for validation errors
      if (response.status === 422 || response.status === 400) {
        throw new Error(errorMessage);
      }
      
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    // Network errors or JSON parsing errors
    if (error instanceof TypeError) {
      throw new Error('Network error: Please check your connection');
    }
    
    // Re-throw with original message
    throw error;
  }
};

/**
 * Fetch all tickets from the API
 * @param {object} params - Query parameters (optional)
 * @returns {Promise<Array>} - Array of tickets
 */
export const fetchTickets = async (params = {}) => {
  const queryString = new URLSearchParams();
  
  // Add pagination - fetch all tickets for Kanban
  queryString.append('limit', params.limit || 1000);
  queryString.append('page', params.page || 1);
  
  // Add other filters if provided
  if (params.sortBy) queryString.append('sortBy', params.sortBy);
  if (params.sortOrder) queryString.append('sortOrder', params.sortOrder);
  
  const url = `${API_BASE_URL}/tickets?${queryString}`;
  const response = await fetchWithErrorHandling(url);
  
  // Handle different response structures
  return response.data || response.tickets || response;
};

/**
 * Update ticket status
 * @param {string} ticketId - Ticket ID
 * @param {object} body - Request body { status: string, position?: number }
 * @returns {Promise<object>} - Updated ticket
 */
export const patchStatus = async (ticketId, body) => {
  if (!ticketId) {
    throw new Error('Ticket ID is required');
  }
  
  if (!body.status) {
    throw new Error('Status is required');
  }
  
  const url = `${API_BASE_URL}/tickets/${ticketId}/status`;
  const response = await fetchWithErrorHandling(url, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });
  
  // Return the updated ticket
  return response.data || response;
};

/**
 * Reorder tickets within a column (optional - for position tracking)
 * @param {string} status - Column status
 * @param {Array<string>} orderedIds - Array of ticket IDs in new order
 * @returns {Promise<void>}
 */
export const reorderTickets = async (status, orderedIds) => {
  if (!status) {
    throw new Error('Status is required');
  }
  
  if (!Array.isArray(orderedIds)) {
    throw new Error('orderedIds must be an array');
  }
  
  const url = `${API_BASE_URL}/tickets/reorder`;
  await fetchWithErrorHandling(url, {
    method: 'PATCH',
    body: JSON.stringify({
      status,
      orderedIds,
    }),
  });
};

/**
 * Get single ticket by ID (useful for detail view)
 * @param {string} ticketId - Ticket ID
 * @returns {Promise<object>} - Ticket data
 */
export const fetchTicketById = async (ticketId) => {
  if (!ticketId) {
    throw new Error('Ticket ID is required');
  }
  
  const url = `${API_BASE_URL}/tickets/${ticketId}`;
  const response = await fetchWithErrorHandling(url);
  
  return response.data || response;
};

/**
 * Update ticket information (not status)
 * @param {string} ticketId - Ticket ID
 * @param {object} data - Updated ticket data
 * @returns {Promise<object>} - Updated ticket
 */
export const updateTicket = async (ticketId, data) => {
  if (!ticketId) {
    throw new Error('Ticket ID is required');
  }
  
  const url = `${API_BASE_URL}/tickets/${ticketId}`;
  const response = await fetchWithErrorHandling(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  
  return response.data || response;
};

export default {
  fetchTickets,
  patchStatus,
  reorderTickets,
  fetchTicketById,
  updateTicket,
};