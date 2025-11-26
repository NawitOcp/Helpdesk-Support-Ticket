/**
 * Kanban Board Types
 * TypeScript definitions for Kanban feature
 */

export type TicketStatus = 'pending' | 'accepted' | 'resolved' | 'rejected';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  position: number;
  contact: {
    name: string;
    email: string;
    phone?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface KanbanColumn {
  id: TicketStatus;
  title: string;
  tickets: Ticket[];
  color: string;
}

export interface DragEndEvent {
  active: {
    id: string;
    data: {
      current: {
        ticket: Ticket;
        columnId: TicketStatus;
      };
    };
  };
  over: {
    id: string;
    data: {
      current?: {
        ticket?: Ticket;
        columnId?: TicketStatus;
        type?: 'column' | 'ticket';
      };
    };
  } | null;
}

export interface StatusTransition {
  from: TicketStatus;
  to: TicketStatus;
  allowed: boolean;
}

export interface OptimisticUpdate {
  ticketId: string;
  previousStatus: TicketStatus;
  previousPosition: number;
  newStatus: TicketStatus;
  newPosition: number;
  timestamp: number;
}

export interface ReorderRequest {
  column: TicketStatus;
  orderedIds: string[];
}

export interface StatusUpdateRequest {
  status: TicketStatus;
  position: number;
}
