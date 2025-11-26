/**
 * KanbanColumn Component Tests
 * 
 * Tests column rendering, ticket display, and droppable functionality.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { DndContext } from '@dnd-kit/core';
import KanbanColumn from '../src/components/KanbanColumn';

// Mock TicketCard to avoid complexity
jest.mock('../src/components/TicketCard', () => {
  return function MockTicketCard({ ticket, onClick }) {
    return (
      <div 
        data-testid={`ticket-card-${ticket.id}`}
        onClick={onClick}
      >
        {ticket.title}
      </div>
    );
  };
});

// Mock tickets for testing
const mockTickets = [
  {
    id: 'ticket-1',
    title: 'Ticket 1',
    description: 'Description 1',
    status: 'pending',
    contact: { name: 'John', email: 'john@test.com' },
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z'
  },
  {
    id: 'ticket-2',
    title: 'Ticket 2',
    description: 'Description 2',
    status: 'pending',
    contact: { name: 'Jane', email: 'jane@test.com' },
    createdAt: '2025-01-14T10:00:00Z',
    updatedAt: '2025-01-14T10:00:00Z'
  }
];

// Helper to render with DnD context
const renderWithDnD = (component) => {
  return render(
    <DndContext>
      {component}
    </DndContext>
  );
};

describe('KanbanColumn Component', () => {
  describe('Rendering', () => {
    it('should render column with correct data-testid', () => {
      renderWithDnD(
        <KanbanColumn 
          id="pending" 
          title="Pending" 
          tickets={[]} 
          onTicketClick={jest.fn()} 
        />
      );
      
      const column = screen.getByTestId('column-pending');
      expect(column).toBeInTheDocument();
    });

    it('should display column title', () => {
      renderWithDnD(
        <KanbanColumn 
          id="pending" 
          title="Pending" 
          tickets={[]} 
          onTicketClick={jest.fn()} 
        />
      );
      
      expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    it('should display ticket count badge', () => {
      renderWithDnD(
        <KanbanColumn 
          id="pending" 
          title="Pending" 
          tickets={mockTickets} 
          onTicketClick={jest.fn()} 
        />
      );
      
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should display zero count for empty column', () => {
      renderWithDnD(
        <KanbanColumn 
          id="pending" 
          title="Pending" 
          tickets={[]} 
          onTicketClick={jest.fn()} 
        />
      );
      
      expect(screen.getByText('0')).toBeInTheDocument();
    });
  });

  describe('Ticket Display', () => {
    it('should render all tickets in the column', () => {
      renderWithDnD(
        <KanbanColumn 
          id="pending" 
          title="Pending" 
          tickets={mockTickets} 
          onTicketClick={jest.fn()} 
        />
      );
      
      expect(screen.getByTestId('ticket-card-ticket-1')).toBeInTheDocument();
      expect(screen.getByTestId('ticket-card-ticket-2')).toBeInTheDocument();
    });

    it('should show "No tickets" message when empty', () => {
      renderWithDnD(
        <KanbanColumn 
          id="pending" 
          title="Pending" 
          tickets={[]} 
          onTicketClick={jest.fn()} 
        />
      );
      
      expect(screen.getByText('No tickets')).toBeInTheDocument();
    });

    it('should render tickets in provided order', () => {
      renderWithDnD(
        <KanbanColumn 
          id="pending" 
          title="Pending" 
          tickets={mockTickets} 
          onTicketClick={jest.fn()} 
        />
      );
      
      const tickets = screen.getAllByTestId(/^ticket-card-/);
      expect(tickets[0]).toHaveAttribute('data-testid', 'ticket-card-ticket-1');
      expect(tickets[1]).toHaveAttribute('data-testid', 'ticket-card-ticket-2');
    });
  });

  describe('Status-Based Styling', () => {
    it('should apply pending styles', () => {
      renderWithDnD(
        <KanbanColumn 
          id="pending" 
          title="Pending" 
          tickets={[]} 
          onTicketClick={jest.fn()} 
        />
      );
      
      const column = screen.getByTestId('column-pending');
      expect(column.className).toContain('orange');
    });

    it('should apply accepted styles', () => {
      renderWithDnD(
        <KanbanColumn 
          id="accepted" 
          title="Accepted" 
          tickets={[]} 
          onTicketClick={jest.fn()} 
        />
      );
      
      const column = screen.getByTestId('column-accepted');
      expect(column.className).toContain('blue');
    });

    it('should apply resolved styles', () => {
      renderWithDnD(
        <KanbanColumn 
          id="resolved" 
          title="Resolved" 
          tickets={[]} 
          onTicketClick={jest.fn()} 
        />
      );
      
      const column = screen.getByTestId('column-resolved');
      expect(column.className).toContain('green');
    });

    it('should apply rejected styles', () => {
      renderWithDnD(
        <KanbanColumn 
          id="rejected" 
          title="Rejected" 
          tickets={[]} 
          onTicketClick={jest.fn()} 
        />
      );
      
      const column = screen.getByTestId('column-rejected');
      expect(column.className).toContain('red');
    });
  });

  describe('Ticket Click Handling', () => {
    it('should call onTicketClick when ticket is clicked', () => {
      const handleClick = jest.fn();
      
      renderWithDnD(
        <KanbanColumn 
          id="pending" 
          title="Pending" 
          tickets={mockTickets} 
          onTicketClick={handleClick} 
        />
      );
      
      const ticket = screen.getByTestId('ticket-card-ticket-1');
      ticket.click();
      
      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(handleClick).toHaveBeenCalledWith(mockTickets[0]);
    });

    it('should handle multiple ticket clicks', () => {
      const handleClick = jest.fn();
      
      renderWithDnD(
        <KankanColumn 
          id="pending" 
          title="Pending" 
          tickets={mockTickets} 
          onTicketClick={handleClick} 
        />
      );
      
      screen.getByTestId('ticket-card-ticket-1').click();
      screen.getByTestId('ticket-card-ticket-2').click();
      
      expect(handleClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('Scrolling', () => {
    it('should have scrollable content area', () => {
      renderWithDnD(
        <KanbanColumn 
          id="pending" 
          title="Pending" 
          tickets={mockTickets} 
          onTicketClick={jest.fn()} 
        />
      );
      
      const column = screen.getByTestId('column-pending');
      const contentArea = column.querySelector('.overflow-y-auto');
      
      expect(contentArea).toBeInTheDocument();
    });

    it('should have max height constraint', () => {
      renderWithDnD(
        <KanbanColumn 
          id="pending" 
          title="Pending" 
          tickets={mockTickets} 
          onTicketClick={jest.fn()} 
        />
      );
      
      const column = screen.getByTestId('column-pending');
      const contentArea = column.querySelector('.max-h-\\[calc\\(100vh-250px\\)\\]');
      
      expect(contentArea).toBeInTheDocument();
    });
  });

  describe('Droppable Behavior', () => {
    it('should accept droppable items (visual test)', () => {
      const { container } = renderWithDnD(
        <KanbanColumn 
          id="pending" 
          title="Pending" 
          tickets={[]} 
          onTicketClick={jest.fn()} 
        />
      );
      
      // Column should be rendered and ready to accept drops
      const column = screen.getByTestId('column-pending');
      expect(column).toBeInTheDocument();
      expect(column).toHaveClass('flex', 'flex-col');
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined tickets array', () => {
      expect(() => {
        renderWithDnD(
          <KanbanColumn 
            id="pending" 
            title="Pending" 
            tickets={undefined} 
            onTicketClick={jest.fn()} 
          />
        );
      }).toThrow(); // Should throw or handle gracefully
    });

    it('should handle large number of tickets', () => {
      const manyTickets = Array.from({ length: 50 }, (_, i) => ({
        id: `ticket-${i}`,
        title: `Ticket ${i}`,
        description: `Description ${i}`,
        status: 'pending',
        contact: { name: `User ${i}`, email: `user${i}@test.com` },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }));
      
      renderWithDnD(
        <KanbanColumn 
          id="pending" 
          title="Pending" 
          tickets={manyTickets} 
          onTicketClick={jest.fn()} 
        />
      );
      
      expect(screen.getByText('50')).toBeInTheDocument();
    });
  });
});