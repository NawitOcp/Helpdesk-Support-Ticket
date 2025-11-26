/**
 * MSW Request Handlers
 * 
 * Defines mock API responses for testing.
 * Simulates backend behavior including validation and state transitions.
 */

import { http, HttpResponse } from 'msw';

// Mock data store (simulates in-memory database)
let mockTickets = [
  {
    id: 'ticket-1',
    title: 'Fix login bug',
    description: 'Users cannot login with special characters',
    contact: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890'
    },
    status: 'pending',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    position: 0
  },
  {
    id: 'ticket-2',
    title: 'Update documentation',
    description: 'API documentation needs updating',
    contact: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '098-765-4321'
    },
    status: 'accepted',
    createdAt: '2025-01-14T14:00:00Z',
    updatedAt: '2025-01-15T09:00:00Z',
    position: 0
  },
  {
    id: 'ticket-3',
    title: 'Database migration',
    description: 'Migrate from MySQL to PostgreSQL',
    contact: {
      name: 'Bob Wilson',
      email: 'bob@example.com',
      phone: null
    },
    status: 'resolved',
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-14T16:00:00Z',
    position: 0
  },
  {
    id: 'ticket-4',
    title: 'Performance issue',
    description: 'API response time is too slow',
    contact: {
      name: 'Alice Brown',
      email: 'alice@example.com',
      phone: '555-123-4567'
    },
    status: 'rejected',
    createdAt: '2025-01-12T11:00:00Z',
    updatedAt: '2025-01-13T15:00:00Z',
    position: 0
  },
];

// Valid status transitions (same as backend)
const VALID_TRANSITIONS = {
  pending: ['accepted', 'rejected'],
  accepted: ['resolved', 'rejected'],
  resolved: [], // Final state
  rejected: []  // Final state
};

/**
 * Reset mock data (useful for test isolation)
 */
export const resetMockTickets = () => {
  mockTickets = [
    {
      id: 'ticket-1',
      title: 'Fix login bug',
      description: 'Users cannot login with special characters',
      contact: { name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
      status: 'pending',
      createdAt: '2025-01-15T10:00:00Z',
      updatedAt: '2025-01-15T10:00:00Z',
      position: 0
    },
    {
      id: 'ticket-2',
      title: 'Update documentation',
      description: 'API documentation needs updating',
      contact: { name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321' },
      status: 'accepted',
      createdAt: '2025-01-14T14:00:00Z',
      updatedAt: '2025-01-15T09:00:00Z',
      position: 0
    },
    {
      id: 'ticket-3',
      title: 'Database migration',
      description: 'Migrate from MySQL to PostgreSQL',
      contact: { name: 'Bob Wilson', email: 'bob@example.com', phone: null },
      status: 'resolved',
      createdAt: '2025-01-10T08:00:00Z',
      updatedAt: '2025-01-14T16:00:00Z',
      position: 0
    },
    {
      id: 'ticket-4',
      title: 'Performance issue',
      description: 'API response time is too slow',
      contact: { name: 'Alice Brown', email: 'alice@example.com', phone: '555-123-4567' },
      status: 'rejected',
      createdAt: '2025-01-12T11:00:00Z',
      updatedAt: '2025-01-13T15:00:00Z',
      position: 0
    },
  ];
};

/**
 * Get mock tickets (for direct access in tests)
 */
export const getMockTickets = () => [...mockTickets];

export const handlers = [
  // GET /api/tickets - List all tickets
  http.get('/api/tickets', ({ request }) => {
    const url = new URL(request.url);
    const status = url.searchParams.getAll('status');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const page = parseInt(url.searchParams.get('page') || '1');
    
    let filteredTickets = [...mockTickets];
    
    // Filter by status if provided
    if (status.length > 0) {
      filteredTickets = filteredTickets.filter(t => status.includes(t.status));
    }
    
    // Apply pagination
    const total = filteredTickets.length;
    const offset = (page - 1) * limit;
    const paginatedTickets = filteredTickets.slice(offset, offset + limit);
    
    return HttpResponse.json({
      success: true,
      data: paginatedTickets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  }),

  // GET /api/tickets/:id - Get single ticket
  http.get('/api/tickets/:id', ({ params }) => {
    const { id } = params;
    const ticket = mockTickets.find(t => t.id === id);
    
    if (!ticket) {
      return HttpResponse.json(
        {
          success: false,
          errorCode: 'TICKET_NOT_FOUND',
          message: `Ticket with ID '${id}' not found`
        },
        { status: 404 }
      );
    }
    
    return HttpResponse.json({
      success: true,
      data: ticket
    });
  }),

  // PATCH /api/tickets/:id/status - Update ticket status
  http.patch('/api/tickets/:id/status', async ({ request, params }) => {
    const { id } = params;
    const body = await request.json();
    const { status: newStatus, position } = body;
    
    // Find ticket
    const ticketIndex = mockTickets.findIndex(t => t.id === id);
    
    if (ticketIndex === -1) {
      return HttpResponse.json(
        {
          success: false,
          errorCode: 'TICKET_NOT_FOUND',
          message: `Ticket with ID '${id}' not found`
        },
        { status: 404 }
      );
    }
    
    const ticket = mockTickets[ticketIndex];
    const currentStatus = ticket.status;
    
    // Validate new status exists
    if (!['pending', 'accepted', 'resolved', 'rejected'].includes(newStatus)) {
      return HttpResponse.json(
        {
          success: false,
          errorCode: 'INVALID_STATUS',
          message: `Invalid status '${newStatus}'`
        },
        { status: 400 }
      );
    }
    
    // Validate status transition
    const allowedTransitions = VALID_TRANSITIONS[currentStatus];
    
    if (!allowedTransitions.includes(newStatus)) {
      const allowed = allowedTransitions.length 
        ? allowedTransitions.join(', ') 
        : 'none (final state)';
      
      return HttpResponse.json(
        {
          success: false,
          errorCode: 'INVALID_STATUS_TRANSITION',
          message: `Cannot transition from '${currentStatus}' to '${newStatus}'. Allowed transitions: ${allowed}`
        },
        { status: 422 }
      );
    }
    
    // Update ticket
    const updatedTicket = {
      ...ticket,
      status: newStatus,
      updatedAt: new Date().toISOString(),
      position: position !== undefined ? position : ticket.position
    };
    
    mockTickets[ticketIndex] = updatedTicket;
    
    return HttpResponse.json({
      success: true,
      message: `Ticket status updated to '${newStatus}'`,
      data: updatedTicket
    });
  }),

  // PATCH /api/tickets/reorder - Reorder tickets (optional)
  http.patch('/api/tickets/reorder', async ({ request }) => {
    const body = await request.json();
    const { status, orderedIds } = body;
    
    if (!status || !Array.isArray(orderedIds)) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Invalid request: status and orderedIds are required'
        },
        { status: 400 }
      );
    }
    
    // Update positions based on order
    orderedIds.forEach((id, index) => {
      const ticketIndex = mockTickets.findIndex(t => t.id === id && t.status === status);
      if (ticketIndex !== -1) {
        mockTickets[ticketIndex].position = index;
      }
    });
    
    return HttpResponse.json({
      success: true,
      message: 'Tickets reordered successfully'
    });
  }),

  // POST /api/tickets - Create new ticket (for completeness)
  http.post('/api/tickets', async ({ request }) => {
    const body = await request.json();
    
    const newTicket = {
      id: `ticket-${Date.now()}`,
      title: body.title,
      description: body.description,
      contact: body.contact || {},
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      position: mockTickets.filter(t => t.status === 'pending').length
    };
    
    mockTickets.push(newTicket);
    
    return HttpResponse.json({
      success: true,
      message: 'Ticket created successfully',
      data: newTicket
    }, { status: 201 });
  }),
];