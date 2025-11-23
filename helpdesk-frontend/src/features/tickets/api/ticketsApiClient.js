import { API_BASE_URL } from '../../../config/apiConfig';

/**
 * Tickets API Client
 * Handles all HTTP requests to the backend API
 */
const ticketsApiClient = {
  /**
   * Get list of tickets with filters and sorting
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Response with tickets array and pagination info
   */
  async getTickets(params = {}) {
    const queryString = new URLSearchParams();
    
    if (params.page) queryString.append('page', params.page);
    if (params.limit) queryString.append('limit', params.limit);
    if (params.sortBy) queryString.append('sortBy', params.sortBy);
    if (params.sortOrder) queryString.append('sortOrder', params.sortOrder);
    
    // Handle multiple status filters
    if (params.status && params.status.length > 0) {
      params.status.forEach(s => queryString.append('status', s));
    }
    
    const url = `${API_BASE_URL}/tickets?${queryString}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch tickets: ${response.statusText}`);
    }
    
    return response.json();
  },

  /**
   * Get single ticket by ID
   * @param {string|number} id - Ticket ID
   * @returns {Promise<Object>} Ticket data
   */
  async getTicket(id) {
    const url = `${API_BASE_URL}/tickets/${id}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch ticket: ${response.statusText}`);
    }
    
    return response.json();
  },

  /**
   * Create a new ticket
   * @param {Object} data - Ticket data
   * @returns {Promise<Object>} Created ticket
   */
  async createTicket(data) {
    const url = `${API_BASE_URL}/tickets`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to create ticket: ${response.statusText}`);
    }
    
    return response.json();
  },

  /**
   * Update ticket information
   * @param {string|number} id - Ticket ID
   * @param {Object} data - Updated ticket data
   * @returns {Promise<Object>} Updated ticket
   */
  async updateTicket(id, data) {
    const url = `${API_BASE_URL}/tickets/${id}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update ticket: ${response.statusText}`);
    }
    
    return response.json();
  },

  /**
   * Update ticket status only
   * @param {string|number} id - Ticket ID
   * @param {string} status - New status
   * @returns {Promise<Object>} Updated ticket
   */
  async updateTicketStatus(id, status) {
    const url = `${API_BASE_URL}/tickets/${id}/status`;
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update ticket status: ${response.statusText}`);
    }
    
    return response.json();
  }
};

export default ticketsApiClient;