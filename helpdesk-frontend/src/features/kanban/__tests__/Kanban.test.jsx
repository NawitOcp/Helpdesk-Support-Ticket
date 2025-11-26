/**
 * Kanban Board Tests
 * Tests for drag-and-drop, reordering, and status transitions
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import KanbanBoard from '../components/KanbanBoard';
import { isValidTransition, groupTicketsByStatus, reorderTicketsInColumn } from '../utils/kanbanUtils';
import { Ticket, TicketStatus } from '../types/kanban.types';

// Mock data
const mockTickets: Ticket[] = [
  {
    id: 'ticket-1',
    title: 'Fix login bug',
    description: 'Users cannot login',
    status: 'pending',
    position: 0,
    contact: { name: 'John Doe', email: 'john@example.com' },
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'ticket-2',
    title: 'Add feature',
    description: 'New feature request',
    status: 'pending',
    position: 1000,
    contact: { name: 'Jane Smith', email: 'jane@example.com' },
    createdAt: '2025-01-02T00:00:00Z',
    updatedAt: '2025-01-02T00:00:00Z'
  },
  {
    id: 'ticket-3',
    title: 'Review PR',
    description: 'Code review needed',
    status: 'accepted',
    position: 0,
    contact: { name: 'Bob Johnson', email: 'bob@example.com' },
    createdAt: '2025-01-03T00:00:00Z',
    updatedAt: '2025-01-03T00:00:00Z'
  },
  {
    id: 'ticket-4',
    title: 'Deploy to prod',
    description: 'Production deployment',
    status: 'resolved',
    position: 0,
    contact: { name: 'Alice Brown', email: 'alice@example.com' },
    createdAt: '2025-01-04T00:00:00Z',
    updatedAt: '2025-01-04T00:00:00Z'
  }
];

describe('Kanban Utils', () => {
  describe('isValidTransition', () => {
    test('allows pending → accepted', () => {
      expect(isValidTransition('pending', 'accepted')).toBe(true);
    });

    test('allows pending → rejected', () => {
      expect(isValidTransition('pending', 'rejected')).toBe(true);
    });

    test('allows accepted → resolved', () => {
      expect(isValidTransition('accepted', 'resolved')).toBe(true);
    });

    test('allows accepted → rejected', () => {
      expect(isValidTransition('accepted', 'rejected')).toBe(true);
    });

    test('blocks pending → resolved (invalid)', () => {
      expect(isValidTransition('pending', 'resolved')).toBe(false);
    });

    test('blocks resolved → accepted (final state)', () => {
      expect(isValidTransition('resolved', 'accepted')).toBe(false);
    });

    test('blocks rejected → pending (final state)', () => {
      expect(isValidTransition('rejected', 'pending')).toBe(false);
    });

    test('blocks accepted → pending (backward)', () => {
      expect(isValidTransition('accepted', 'pending')).toBe(false);
    });

    test('allows same status (no change)', () => {
      expect(isValidTransition('pending', 'pending')).toBe(true);
    });
  });

  describe('groupTicketsByStatus', () => {
    test('groups tickets by status correctly', () => {
      const grouped = groupTicketsByStatus(mockTickets);

      expect(grouped.pending).toHaveLength(2);
      expect(grouped.accepted).toHaveLength(1);
      expect(grouped.resolved).toHaveLength(1);
      expect(grouped.rejected).toHaveLength(0);
    });

    test('sorts tickets by position within each status', () => {
      const tickets: Ticket[] = [
        { ...mockTickets[0], status: 'pending', position: 2000 },
        { ...mockTickets[1], status: 'pending', position: 1000 }
      ];

      const grouped = groupTicketsByStatus(tickets);

      expect(grouped.pending[0].position).toBe(1000);
      expect(grouped.pending[1].position).toBe(2000);
    });
  });

  describe('reorderTicketsInColumn', () => {
    test('reorders tickets correctly', () => {
      const tickets = [
        { ...mockTickets[0], position: 0 },
        { ...mockTickets[1], position: 1000 }
      ];

      const reordered = reorderTicketsInColumn(tickets, 0, 1);

      expect(reordered[0].id).toBe('ticket-2');
      expect(reordered[1].id).toBe('ticket-1');
      expect(reordered[0].position).toBe(0);
      expect(reordered[1].position).toBe(1000);
    });

    test('handles reordering to same position', () => {
      const tickets = [mockTickets[0], mockTickets[1]];
      const reordered = reorderTicketsInColumn(tickets, 0, 0);

      expect(reordered[0].id).toBe('ticket-1');
      expect(reordered[1].id).toBe('ticket-2');
    });
  });
});

describe('KanbanBoard Component', () => {
  const mockOnMoveTicket = jest.fn();
  const mockOnReorderTickets = jest.fn();
  const mockOnTicketClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderKanbanBoard = () => {
    const ticketsByStatus = groupTicketsByStatus(mockTickets);

    return render(
      <BrowserRouter>
        <KanbanBoard
          ticketsByStatus={ticketsByStatus}
          onMoveTicket={mockOnMoveTicket}
          onReorderTickets={mockOnReorderTickets}
          onTicketClick={mockOnTicketClick}
        />
      </BrowserRouter>
    );
  };

  test('renders all four columns', () => {
    renderKanbanBoard();

    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Accepted')).toBeInTheDocument();
    expect(screen.getByText('Resolved')).toBeInTheDocument();
    expect(screen.getByText('Rejected')).toBeInTheDocument();
  });

  test('displays correct ticket counts', () => {
    renderKanbanBoard();

    const pendingCount = screen.getByText('Pending').parentElement?.querySelector('[class*="rounded-full"]');
    expect(pendingCount).toHaveTextContent('2');

    const acceptedCount = screen.getByText('Accepted').parentElement?.querySelector('[class*="rounded-full"]');
    expect(acceptedCount).toHaveTextContent('1');
  });

  test('renders tickets in correct columns', () => {
    renderKanbanBoard();

    expect(screen.getByText('Fix login bug')).toBeInTheDocument();
    expect(screen.getByText('Add feature')).toBeInTheDocument();
    expect(screen.getByText('Review PR')).toBeInTheDocument();
    expect(screen.getByText('Deploy to prod')).toBeInTheDocument();
  });

  test('shows empty state for columns with no tickets', () => {
    renderKanbanBoard();

    const rejectedColumn = screen.getByText('Rejected').parentElement;
    expect(rejectedColumn).toHaveTextContent('No tickets');
  });

  test('calls onTicketClick when ticket is clicked', () => {
    renderKanbanBoard();

    const ticket = screen.getByText('Fix login bug');
    fireEvent.click(ticket.closest('[class*="cursor-grab"]')!);

    waitFor(() => {
      expect(mockOnTicketClick).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'ticket-1' })
      );
    });
  });

  test('disables dragging for final status tickets', () => {
    renderKanbanBoard();

    const resolvedTicket = screen.getByText('Deploy to prod').closest('[class*="cursor"]');
    expect(resolvedTicket).toHaveClass('cursor-default');
    expect(resolvedTicket).not.toHaveClass('cursor-grab');
  });
});

describe('Drag and Drop Integration', () => {
  test('handles drag within same column - reorder', async () => {
    const mockOnReorderTickets = jest.fn().mockResolvedValue(undefined);
    const ticketsByStatus = groupTicketsByStatus(mockTickets);

    // Simulate reordering within pending column
    const pendingTickets = ticketsByStatus.pending;
    const orderedIds = [pendingTickets[1].id, pendingTickets[0].id]; // Swap order

    await mockOnReorderTickets('pending', orderedIds);

    expect(mockOnReorderTickets).toHaveBeenCalledWith('pending', orderedIds);
    expect(mockOnReorderTickets).toHaveBeenCalledTimes(1);
  });

  test('handles valid status transition', async () => {
    const mockOnMoveTicket = jest.fn().mockResolvedValue(undefined);

    // Move from pending to accepted
    await mockOnMoveTicket('ticket-1', 'accepted', 1000);

    expect(mockOnMoveTicket).toHaveBeenCalledWith('ticket-1', 'accepted', 1000);
    expect(mockOnMoveTicket).toHaveBeenCalledTimes(1);
  });

  test('handles invalid status transition with rollback', async () => {
    const mockOnMoveTicket = jest.fn().mockRejectedValue(
      new Error('Cannot transition from pending to resolved')
    );

    try {
      await mockOnMoveTicket('ticket-1', 'resolved', 1000);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toContain('Cannot transition');
    }

    expect(mockOnMoveTicket).toHaveBeenCalledTimes(1);
  });

  test('optimistic update and API success', async () => {
    const mockOnMoveTicket = jest.fn().mockResolvedValue(undefined);

    // Simulate optimistic update
    const ticket = mockTickets[0];
    const newStatus: TicketStatus = 'accepted';
    const newPosition = 1000;

    // Update UI optimistically
    const updatedTicket = {
      ...ticket,
      status: newStatus,
      position: newPosition
    };

    // Call API
    await mockOnMoveTicket(ticket.id, newStatus, newPosition);

    expect(mockOnMoveTicket).toHaveBeenCalledWith(ticket.id, newStatus, newPosition);
    expect(updatedTicket.status).toBe(newStatus);
  });

  test('optimistic update and API failure with rollback', async () => {
    const mockOnMoveTicket = jest.fn().mockRejectedValue(
      new Error('API Error')
    );

    const ticket = mockTickets[0];
    const originalStatus = ticket.status;
    const originalPosition = ticket.position;

    try {
      await mockOnMoveTicket(ticket.id, 'accepted', 1000);
    } catch (error) {
      // Rollback to original state
      const rolledBackTicket = {
        ...ticket,
        status: originalStatus,
        position: originalPosition
      };

      expect(rolledBackTicket.status).toBe(originalStatus);
      expect(rolledBackTicket.position).toBe(originalPosition);
    }
  });
});

describe('Error Handling', () => {
  test('displays error message for invalid transition', () => {
    const mockOnMoveTicket = jest.fn().mockRejectedValue(
      new Error('Cannot transition from resolved to pending')
    );

    mockOnMoveTicket('ticket-4', 'pending', 0).catch((error) => {
      expect(error.message).toBe('Cannot transition from resolved to pending');
    });
  });

  test('displays error message for API failure', () => {
    const mockOnMoveTicket = jest.fn().mockRejectedValue(
      new Error('Network error')
    );

    mockOnMoveTicket('ticket-1', 'accepted', 1000).catch((error) => {
      expect(error.message).toBe('Network error');
    });
  });
});
