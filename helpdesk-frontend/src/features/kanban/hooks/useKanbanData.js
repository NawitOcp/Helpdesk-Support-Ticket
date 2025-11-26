/**
 * useKanbanData Hook
 * Custom hook for managing Kanban board data with optimistic updates
 */

import { useState, useEffect, useCallback } from "react";
import kanbanApiClient from "../api/kanbanApiClient";
import {
  groupTicketsByStatus,
  calculateNewPosition,
  reorderTicketsInColumn,
} from "../utils/kanbanUtils";

const useKanbanData = () => {
  const [tickets, setTickets] = useState([]);
  const [ticketsByStatus, setTicketsByStatus] = useState({
    pending: [],
    accepted: [],
    resolved: [],
    rejected: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [optimisticUpdates, setOptimisticUpdates] = useState([]);

  /**
   * Fetch all tickets
   */
  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await kanbanApiClient.fetchAllTickets();
      setTickets(data);
      setTicketsByStatus(groupTicketsByStatus(data));
    } catch (err) {
      console.error("Error fetching tickets:", err);
      setError(err.message || "Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Move ticket to different column
   */
  const moveTicket = async (ticketId, fromStatus, toStatus) => {
    // Store original state for rollback
    const originalTickets = tickets;
    const originalByStatus = ticketsByStatus;

    // Create optimistic update
    const updateId = Date.now();
    setOptimisticUpdates((prev) => [
      ...prev,
      { id: updateId, ticketId, fromStatus, toStatus },
    ]);

    try {
      // Optimistic update
      const ticket = tickets.find((t) => t.id === ticketId);
      if (!ticket) throw new Error("Ticket not found");

      const targetTickets = ticketsByStatus[toStatus];
      const newPosition = calculateNewPosition(
        targetTickets.length,
        targetTickets
      );

      const updatedTicket = { ...ticket, status: toStatus, position: newPosition };
      const newTickets = tickets.map((t) => (t.id === ticketId ? updatedTicket : t));

      setTickets(newTickets);
      setTicketsByStatus(groupTicketsByStatus(newTickets));

      // API call
      await kanbanApiClient.updateTicketStatus(ticketId, toStatus, newPosition);

      // Remove optimistic update on success
      setOptimisticUpdates((prev) => prev.filter((u) => u.id !== updateId));
    } catch (err) {
      console.error("Error moving ticket:", err);

      // Rollback on error
      setTickets(originalTickets);
      setTicketsByStatus(originalByStatus);
      setOptimisticUpdates((prev) => prev.filter((u) => u.id !== updateId));

      setError(err.message || "Failed to move ticket");
      throw err;
    }
  };

  /**
   * Reorder tickets within same column
   */
  const reorderTickets = async (column, ticketId, oldIndex, newIndex) => {
    const originalTickets = tickets;
    const originalByStatus = ticketsByStatus;

    try {
      // Optimistic update
      const columnTickets = ticketsByStatus[column];
      const reorderedTickets = reorderTicketsInColumn(
        columnTickets,
        oldIndex,
        newIndex
      );

      const newTickets = tickets.map((ticket) => {
        const reordered = reorderedTickets.find((t) => t.id === ticket.id);
        return reordered || ticket;
      });

      setTickets(newTickets);
      setTicketsByStatus(groupTicketsByStatus(newTickets));

      // API call
      const orderedIds = reorderedTickets.map((t) => t.id);
      await kanbanApiClient.reorderTickets(column, orderedIds);
    } catch (err) {
      console.error("Error reordering tickets:", err);

      // Rollback on error
      setTickets(originalTickets);
      setTicketsByStatus(originalByStatus);

      setError(err.message || "Failed to reorder tickets");
      throw err;
    }
  };

  /**
   * Refetch tickets
   */
  const refetch = useCallback(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Initial fetch
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return {
    tickets,
    ticketsByStatus,
    loading,
    error,
    moveTicket,
    reorderTickets,
    refetch,
  };
};

export default useKanbanData;