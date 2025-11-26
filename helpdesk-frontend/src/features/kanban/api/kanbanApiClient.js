/**
 * Kanban API Client
 * Handles all API calls for Kanban board
 */

import { API_BASE_URL } from "../../../config/apiConfig";

const kanbanApiClient = {
  /**
   * Fetch all tickets
   */
  async fetchAllTickets() {
    try {
      const response = await fetch(`${API_BASE_URL}/tickets?limit=1000`);

      if (!response.ok) {
        throw new Error(`Failed to fetch tickets: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("API Error - fetchAllTickets:", error);
      throw error;
    }
  },

  /**
   * Fetch single ticket
   */
  async fetchTicket(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/${id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch ticket: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("API Error - fetchTicket:", error);
      throw error;
    }
  },

  /**
   * Update ticket status with position
   */
  async updateTicketStatus(ticketId, status, position) {
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status, position }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to update status: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("API Error - updateTicketStatus:", error);
      throw error;
    }
  },

  /**
   * Reorder tickets within a column
   */
  async reorderTickets(column, orderedIds) {
    try {
      const response = await fetch(`${API_BASE_URL}/tickets/reorder`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          column,
          orderedIds,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to reorder tickets: ${response.statusText}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("API Error - reorderTickets:", error);
      throw error;
    }
  },
};

export default kanbanApiClient;