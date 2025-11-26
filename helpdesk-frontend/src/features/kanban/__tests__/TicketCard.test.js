/**
 * TicketCard Component Tests
 * 
 * Tests ticket card rendering, display, and interactions.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { DndContext } from '@dnd-kit/core';
import TicketCard from '../src/components/TicketCard';

// Mock ticket data
const mockTicket = {
  id: 'test-ticket-1',
  title: 'Test Ticket Title',
  description: 'This is a test ticket description that should be displayed on the card.',
  contact: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890'
  },
  status: 'pending',
  createdAt: '2025-01-15T10:00:00Z',
  updatedAt: '2025-01-15T14:30:00Z'
};

// Helper to render with DnD context
const renderWithDnD = (component) => {
  return render(
    <DndContext>
      {component}
    </DndContext>
  );
};

describe('TicketCard Component', () => {
  describe('Rendering', () => {
    it('should render ticket card with correct data-testid', () => {
      renderWithDnD(<TicketCard ticket={mockTicket} />);
      
      const card = screen.getByTestId(`ticket-card-${mockTicket.id}`);
      expect(card).toBeInTheDocument();
    });

    it('should display ticket title', () => {
      renderWithDnD(<TicketCard ticket={mockTicket} />);
      
      expect(screen.getByText(mockTicket.title)).toBeInTheDocument();
    });

    it('should display truncated description', () => {
      renderWithDnD(<TicketCard ticket={mockTicket} />);
      
      // Description should be present (may be truncated)
      expect(screen.getByText(/This is a test ticket description/)).toBeInTheDocument();
    });

    it('should display contact name', () => {
      renderWithDnD(<TicketCard ticket={mockTicket} />);
      
      expect(screen.getByText(mockTicket.contact.name)).toBeInTheDocument();
    });

    it('should display ticket ID (truncated)', () => {
      renderWithDnD(<TicketCard ticket={mockTicket} />);
      
      // ID is displayed truncated with # prefix
      const truncatedId = mockTicket.id.substring(0, 8);
      expect(screen.getByText(`#${truncatedId}`)).toBeInTheDocument();
    });

    it('should display formatted updated timestamp', () => {
      renderWithDnD(<TicketCard ticket={mockTicket} />);
      
      // Check for date elements (format may vary)
      const timeElements = screen.getAllByText(/Jan|14|30|2025/);
      expect(timeElements.length).toBeGreaterThan(0);
    });
  });

  describe('Long Content Handling', () => {
    it('should truncate long descriptions', () => {
      const longDescription = 'A'.repeat(150);
      const ticketWithLongDesc = {
        ...mockTicket,
        description: longDescription
      };
      
      renderWithDnD(<TicketCard ticket={ticketWithLongDesc} />);
      
      // Should not show all 150 characters
      const card = screen.getByTestId(`ticket-card-${mockTicket.id}`);
      expect(card.textContent).not.toContain(longDescription);
    });

    it('should truncate long titles with line-clamp', () => {
      const longTitle = 'Very Long Title '.repeat(20);
      const ticketWithLongTitle = {
        ...mockTicket,
        title: longTitle
      };
      
      renderWithDnD(<TicketCard ticket={ticketWithLongTitle} />);
      
      const card = screen.getByTestId(`ticket-card-${mockTicket.id}`);
      expect(card).toBeInTheDocument();
    });
  });

  describe('Optional Fields', () => {
    it('should handle ticket without contact name', () => {
      const ticketNoContact = {
        ...mockTicket,
        contact: {
          email: 'test@example.com',
          phone: null
        }
      };
      
      renderWithDnD(<TicketCard ticket={ticketNoContact} />);
      
      const card = screen.getByTestId(`ticket-card-${mockTicket.id}`);
      expect(card).toBeInTheDocument();
    });

    it('should handle ticket without phone', () => {
      const ticketNoPhone = {
        ...mockTicket,
        contact: {
          name: 'Jane Doe',
          email: 'jane@example.com',
          phone: null
        }
      };
      
      renderWithDnD(<TicketCard ticket={ticketNoPhone} />);
      
      expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    });
  });

  describe('Click Interactions', () => {
    it('should call onClick when card is clicked', () => {
      const handleClick = jest.fn();
      
      renderWithDnD(<TicketCard ticket={mockTicket} onClick={handleClick} />);
      
      const card = screen.getByTestId(`ticket-card-${mockTicket.id}`);
      card.click();
      
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not throw error if onClick is not provided', () => {
      expect(() => {
        renderWithDnD(<TicketCard ticket={mockTicket} />);
        const card = screen.getByTestId(`ticket-card-${mockTicket.id}`);
        card.click();
      }).not.toThrow();
    });
  });

  describe('Drag State', () => {
    it('should apply dragging styles when isDragging is true', () => {
      renderWithDnD(<TicketCard ticket={mockTicket} isDragging={true} />);
      
      const card = screen.getByTestId(`ticket-card-${mockTicket.id}`);
      expect(card.className).toContain('shadow-lg');
    });

    it('should not apply dragging styles when isDragging is false', () => {
      renderWithDnD(<TicketCard ticket={mockTicket} isDragging={false} />);
      
      const card = screen.getByTestId(`ticket-card-${mockTicket.id}`);
      expect(card.className).not.toContain('shadow-lg');
    });
  });

  describe('Accessibility', () => {
    it('should have cursor-move class for drag affordance', () => {
      renderWithDnD(<TicketCard ticket={mockTicket} />);
      
      const card = screen.getByTestId(`ticket-card-${mockTicket.id}`);
      expect(card.className).toContain('cursor-move');
    });

    it('should render SVG icons for visual clarity', () => {
      const { container } = renderWithDnD(<TicketCard ticket={mockTicket} />);
      
      const svgs = container.querySelectorAll('svg');
      expect(svgs.length).toBeGreaterThan(0);
    });
  });
});