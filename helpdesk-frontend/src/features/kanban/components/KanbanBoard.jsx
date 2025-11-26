import React, { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import TicketCard from './TicketCard';
import TicketDetailModal from './TicketDetailModal';
import { fetchTickets, patchStatus } from '../../../lib/api';

/**
 * KanbanBoard Component
 * 
 * Main board component that manages tickets across columns with drag & drop.
 * Enforces status transition rules and handles optimistic updates with rollback.
 * 
 * Status transition rules:
 * - pending → accepted | rejected
 * - accepted → resolved | rejected  
 * - resolved → (final state, no moves allowed)
 * - rejected → (final state, no moves allowed)
 */
const KanbanBoard = () => {
  const [tickets, setTickets] = useState({
    pending: [],
    accepted: [],
    resolved: [],
    rejected: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [toast, setToast] = useState(null);

  // Define allowed status transitions
  const ALLOWED_TRANSITIONS = {
    pending: ['accepted', 'rejected'],
    accepted: ['resolved', 'rejected'],
    resolved: [], // Final state
    rejected: []  // Final state
  };

  // DnD sensors configuration
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /**
   * Fetch tickets from API and organize by status
   */
  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchTickets();
      
      // Organize tickets by status
      const organized = {
        pending: [],
        accepted: [],
        resolved: [],
        rejected: []
      };
      
      data.forEach(ticket => {
        if (organized[ticket.status]) {
          organized[ticket.status].push(ticket);
        }
      });
      
      // Sort by position if available, otherwise by updatedAt
      Object.keys(organized).forEach(status => {
        organized[status].sort((a, b) => {
          if (a.position !== undefined && b.position !== undefined) {
            return a.position - b.position;
          }
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        });
      });
      
      setTickets(organized);
    } catch (err) {
      console.error('Failed to load tickets:', err);
      setError('Failed to load tickets. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  /**
   * Show toast notification
   */
  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  /**
   * Find ticket and its container by ID
   */
  const findTicketContainer = (ticketId) => {
    for (const [status, statusTickets] of Object.entries(tickets)) {
      if (statusTickets.find(t => t.id === ticketId)) {
        return status;
      }
    }
    return null;
  };

  /**
   * Handle drag start
   */
  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
  };

  /**
   * Handle drag over (visual feedback only)
   */
  const handleDragOver = (event) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeContainer = findTicketContainer(active.id);
    
    // Determine overContainer correctly
    let overContainer;
    if (['pending', 'accepted', 'resolved', 'rejected'].includes(over.id)) {
      overContainer = over.id;
    } else if (over.data?.current?.sortable?.containerId) {
      overContainer = over.data.current.sortable.containerId;
    } else {
      overContainer = findTicketContainer(over.id);
    }
    
    if (!activeContainer || !overContainer) return;
    
    // Check if dropping in a different container
    if (activeContainer !== overContainer) {
      // Validate transition before visual update
      const isValidTransition = ALLOWED_TRANSITIONS[activeContainer]?.includes(overContainer);
      
      if (!isValidTransition) {
        // Don't provide visual feedback for invalid moves
        return;
      }
    }
  };

  /**
   * Handle drag end - perform status update
   */
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    setActiveId(null);
    
    if (!over) return;
    
    const activeContainer = findTicketContainer(active.id);
    
    // Determine the target container correctly
    let overContainer;
    
    // Check if dropped directly on a column (droppable zone)
    if (['pending', 'accepted', 'resolved', 'rejected'].includes(over.id)) {
      overContainer = over.id;
    } 
    // Check if dropped on a ticket (sortable item) - get its container
    else if (over.data?.current?.sortable?.containerId) {
      overContainer = over.data.current.sortable.containerId;
    }
    // Fallback: try to find container by ticket ID
    else {
      overContainer = findTicketContainer(over.id);
    }
    
    if (!activeContainer || !overContainer) return;
    
    const activeTicket = tickets[activeContainer].find(t => t.id === active.id);
    
    if (!activeTicket) return;
    
    // Case 1: Reordering within same column
    if (activeContainer === overContainer) {
      const activeIndex = tickets[activeContainer].findIndex(t => t.id === active.id);
      const overIndex = tickets[activeContainer].findIndex(t => t.id === over.id);
      
      if (activeIndex !== overIndex && overIndex !== -1) {
        setTickets(prev => ({
          ...prev,
          [activeContainer]: arrayMove(prev[activeContainer], activeIndex, overIndex)
        }));
      }
      
      return;
    }
    
    // Case 2: Moving to different column (status change)
    const newStatus = overContainer;
    
    // Validate transition
    const isValidTransition = ALLOWED_TRANSITIONS[activeContainer]?.includes(newStatus);
    
    if (!isValidTransition) {
      const finalStates = ALLOWED_TRANSITIONS[activeContainer]?.length === 0;
      const message = finalStates 
        ? `Cannot move ticket from ${activeContainer} (final state)`
        : `Invalid transition: ${activeContainer} → ${newStatus}. Allowed: ${ALLOWED_TRANSITIONS[activeContainer].join(', ')}`;
      
      showToast(message, 'error');
      return;
    }
    
    // Optimistic UI update - CRITICAL: Create deep copy to avoid mutation
    const previousTickets = JSON.parse(JSON.stringify(tickets));
    
    setTickets(prev => {
      // Create a fresh copy
      const newTickets = {
        pending: [...prev.pending],
        accepted: [...prev.accepted],
        resolved: [...prev.resolved],
        rejected: [...prev.rejected]
      };
      
      // Remove ticket from old container
      newTickets[activeContainer] = newTickets[activeContainer].filter(t => t.id !== active.id);
      
      // Create updated ticket
      const updatedTicket = {
        ...activeTicket,
        status: newStatus,
        updatedAt: new Date().toISOString()
      };
      
      // Add to new container
      // If dropped on a specific ticket, insert at that position
      if (over.id !== newStatus && !['pending', 'accepted', 'resolved', 'rejected'].includes(over.id)) {
        const overIndex = newTickets[newStatus].findIndex(t => t.id === over.id);
        if (overIndex !== -1) {
          newTickets[newStatus].splice(overIndex, 0, updatedTicket);
        } else {
          newTickets[newStatus].push(updatedTicket);
        }
      } else {
        // Dropped on column header - add to end
        newTickets[newStatus].push(updatedTicket);
      }
      
      return newTickets;
    });
    
    // API call with rollback on error
    try {
      await patchStatus(active.id, {
        status: newStatus
      });
      
      showToast(`Ticket moved to ${newStatus}`, 'success');
    } catch (err) {
      console.error('Failed to update ticket status:', err);
      
      // Rollback optimistic update
      setTickets(previousTickets);
      
      const errorMessage = err.message || 'Failed to update ticket status';
      showToast(errorMessage, 'error');
    }
  };

  /**
   * Get the active ticket being dragged
   */
  const getActiveTicket = () => {
    if (!activeId) return null;
    
    for (const statusTickets of Object.values(tickets)) {
      const ticket = statusTickets.find(t => t.id === activeId);
      if (ticket) return ticket;
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading tickets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="h-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full">
          {Object.keys(tickets).map(status => (
            <KanbanColumn
              key={status}
              id={status}
              title={status.charAt(0).toUpperCase() + status.slice(1)}
              tickets={tickets[status]}
              onTicketClick={setSelectedTicket}
            />
          ))}
        </div>
        
        <DragOverlay>
          {activeId ? (
            <div className="rotate-3 opacity-80">
              <TicketCard ticket={getActiveTicket()} isDragging />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      
      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdate={loadTickets}
        />
      )}
      
      {/* Toast Notification */}
      {toast && (
        <div 
          className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white transition-opacity ${
            toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'
          }`}
          role="alert"
          data-testid="toast-notification"
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;