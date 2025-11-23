/**
 * Tickets Service Unit Tests
 * 
 * Tests business logic in isolation with mocked repository.
 */

import { jest } from '@jest/globals';

// ======================
// Mock Repository
// ======================

const mockRepository = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn()
};

// Mock the repository module
jest.unstable_mockModule('../src/infrastructure/repositories/tickets.repository.js', () => mockRepository);

// Import service after mocking
const { listTickets, getTicketById, createTicket, updateTicket, updateTicketStatus } = 
  await import('../src/application/services/tickets.service.js');

// ======================
// Test Setup
// ======================

describe('Tickets Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ======================
  // createTicket
  // ======================

  describe('createTicket', () => {
    it('should create ticket with pending status', async () => {
      const input = {
        title: 'Test Ticket',
        description: 'Test Description',
        contact: { name: 'John', email: 'john@test.com' }
      };

      mockRepository.create.mockResolvedValue({
        id: 'new-id',
        ...input,
        status: 'pending',
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      });

      const result = await createTicket(input);

      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Ticket',
          description: 'Test Description',
          status: 'pending'
        })
      );
    });

    it('should throw error if title is missing', async () => {
      const input = { description: 'Test', contact: { name: 'A', email: 'a@a.com' } };

      await expect(createTicket(input)).rejects.toThrow('Title is required');
    });

    it('should throw error if description is missing', async () => {
      const input = { title: 'Test', contact: { name: 'A', email: 'a@a.com' } };

      await expect(createTicket(input)).rejects.toThrow('Description is required');
    });

    it('should trim whitespace from title and description', async () => {
      const input = {
        title: '  Spaced Title  ',
        description: '  Spaced Description  ',
        contact: { name: 'John', email: 'john@test.com' }
      };

      mockRepository.create.mockImplementation(ticket => Promise.resolve(ticket));

      await createTicket(input);

      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Spaced Title',
          description: 'Spaced Description'
        })
      );
    });
  });

  // ======================
  // updateTicketStatus - Valid Transitions
  // ======================

  describe('updateTicketStatus - Valid Transitions', () => {
    it('should allow pending → accepted', async () => {
      mockRepository.findById.mockResolvedValue({
        id: '1', status: 'pending', title: 'Test', description: 'Test'
      });
      mockRepository.update.mockImplementation((id, updates) => 
        Promise.resolve({ id, ...updates })
      );

      const result = await updateTicketStatus('1', 'accepted');

      expect(result.status).toBe('accepted');
      expect(mockRepository.update).toHaveBeenCalledWith('1', expect.objectContaining({
        status: 'accepted'
      }));
    });

    it('should allow pending → rejected', async () => {
      mockRepository.findById.mockResolvedValue({
        id: '1', status: 'pending', title: 'Test', description: 'Test'
      });
      mockRepository.update.mockImplementation((id, updates) => 
        Promise.resolve({ id, ...updates })
      );

      const result = await updateTicketStatus('1', 'rejected');

      expect(result.status).toBe('rejected');
    });

    it('should allow accepted → resolved', async () => {
      mockRepository.findById.mockResolvedValue({
        id: '1', status: 'accepted', title: 'Test', description: 'Test'
      });
      mockRepository.update.mockImplementation((id, updates) => 
        Promise.resolve({ id, ...updates })
      );

      const result = await updateTicketStatus('1', 'resolved');

      expect(result.status).toBe('resolved');
    });

    it('should allow accepted → rejected', async () => {
      mockRepository.findById.mockResolvedValue({
        id: '1', status: 'accepted', title: 'Test', description: 'Test'
      });
      mockRepository.update.mockImplementation((id, updates) => 
        Promise.resolve({ id, ...updates })
      );

      const result = await updateTicketStatus('1', 'rejected');

      expect(result.status).toBe('rejected');
    });
  });

  // ======================
  // updateTicketStatus - Invalid Transitions
  // ======================

  describe('updateTicketStatus - Invalid Transitions', () => {
    it('should reject pending → resolved', async () => {
      mockRepository.findById.mockResolvedValue({
        id: '1', status: 'pending', title: 'Test', description: 'Test'
      });

      await expect(updateTicketStatus('1', 'resolved'))
        .rejects.toThrow("Cannot transition from 'pending' to 'resolved'");
    });

    it('should reject resolved → accepted (final state)', async () => {
      mockRepository.findById.mockResolvedValue({
        id: '1', status: 'resolved', title: 'Test', description: 'Test'
      });

      await expect(updateTicketStatus('1', 'accepted'))
        .rejects.toThrow("Cannot transition from 'resolved' to 'accepted'");
    });

    it('should reject resolved → pending (final state)', async () => {
      mockRepository.findById.mockResolvedValue({
        id: '1', status: 'resolved', title: 'Test', description: 'Test'
      });

      await expect(updateTicketStatus('1', 'pending'))
        .rejects.toThrow('none (final state)');
    });

    it('should reject rejected → accepted (final state)', async () => {
      mockRepository.findById.mockResolvedValue({
        id: '1', status: 'rejected', title: 'Test', description: 'Test'
      });

      await expect(updateTicketStatus('1', 'accepted'))
        .rejects.toThrow('none (final state)');
    });

    it('should reject rejected → pending (final state)', async () => {
      mockRepository.findById.mockResolvedValue({
        id: '1', status: 'rejected', title: 'Test', description: 'Test'
      });

      await expect(updateTicketStatus('1', 'pending'))
        .rejects.toThrow('none (final state)');
    });

    it('should reject accepted → pending (backwards)', async () => {
      mockRepository.findById.mockResolvedValue({
        id: '1', status: 'accepted', title: 'Test', description: 'Test'
      });

      await expect(updateTicketStatus('1', 'pending'))
        .rejects.toThrow("Cannot transition from 'accepted' to 'pending'");
    });
  });

  // ======================
  // updateTicketStatus - Edge Cases
  // ======================

  describe('updateTicketStatus - Edge Cases', () => {
    it('should return null if ticket not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const result = await updateTicketStatus('non-existent', 'accepted');

      expect(result).toBeNull();
    });

    it('should throw error for invalid status value', async () => {
      mockRepository.findById.mockResolvedValue({
        id: '1', status: 'pending', title: 'Test', description: 'Test'
      });

      await expect(updateTicketStatus('1', 'invalid-status'))
        .rejects.toThrow("Invalid status 'invalid-status'");
    });

    it('should update updatedAt timestamp', async () => {
      const originalDate = '2025-01-01T00:00:00Z';
      mockRepository.findById.mockResolvedValue({
        id: '1', status: 'pending', updatedAt: originalDate
      });
      mockRepository.update.mockImplementation((id, updates) => 
        Promise.resolve({ id, ...updates })
      );

      await updateTicketStatus('1', 'accepted');

      expect(mockRepository.update).toHaveBeenCalledWith('1', expect.objectContaining({
        updatedAt: expect.any(String)
      }));
      
      const updateCall = mockRepository.update.mock.calls[0][1];
      expect(updateCall.updatedAt).not.toBe(originalDate);
    });
  });

  // ======================
  // updateTicket (Info Only)
  // ======================

  describe('updateTicket', () => {
    it('should update title and description', async () => {
      mockRepository.findById.mockResolvedValue({
        id: '1', title: 'Old', description: 'Old desc', status: 'pending',
        contact: { name: 'A', email: 'a@a.com' }
      });
      mockRepository.update.mockImplementation((id, updates) => 
        Promise.resolve({ id, title: 'Old', description: 'Old desc', ...updates })
      );

      const result = await updateTicket('1', { 
        title: 'New Title', 
        description: 'New Description' 
      });

      expect(mockRepository.update).toHaveBeenCalledWith('1', expect.objectContaining({
        title: 'New Title',
        description: 'New Description'
      }));
    });

    it('should NOT update status through updateTicket', async () => {
      mockRepository.findById.mockResolvedValue({
        id: '1', title: 'Test', description: 'Test', status: 'pending',
        contact: { name: 'A', email: 'a@a.com' }
      });
      mockRepository.update.mockImplementation((id, updates) => 
        Promise.resolve({ id, status: 'pending', ...updates })
      );

      await updateTicket('1', { title: 'New', status: 'accepted' });

      // Status should not be in the update call
      const updateCall = mockRepository.update.mock.calls[0][1];
      expect(updateCall.status).toBeUndefined();
    });

    it('should return null if ticket not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const result = await updateTicket('non-existent', { title: 'New' });

      expect(result).toBeNull();
    });

    it('should throw error if title is empty string', async () => {
      mockRepository.findById.mockResolvedValue({
        id: '1', title: 'Test', description: 'Test', status: 'pending'
      });

      await expect(updateTicket('1', { title: '   ' }))
        .rejects.toThrow('Title cannot be empty');
    });
  });

  // ======================
  // listTickets
  // ======================

  describe('listTickets', () => {
    const mockTickets = [
      { id: '1', status: 'pending', updatedAt: '2025-01-01T00:00:00Z' },
      { id: '2', status: 'accepted', updatedAt: '2025-01-02T00:00:00Z' },
      { id: '3', status: 'resolved', updatedAt: '2025-01-03T00:00:00Z' }
    ];

    it('should return paginated results', async () => {
      mockRepository.findAll.mockResolvedValue(mockTickets);

      const result = await listTickets({ page: 1, limit: 2 });

      expect(result.tickets).toHaveLength(2);
      expect(result.pagination.total).toBe(3);
      expect(result.pagination.totalPages).toBe(2);
    });

    it('should filter by status', async () => {
      mockRepository.findAll.mockResolvedValue(mockTickets);

      const result = await listTickets({ status: 'pending', page: 1, limit: 10 });

      expect(result.tickets).toHaveLength(1);
      expect(result.tickets[0].status).toBe('pending');
    });

    it('should filter by multiple statuses', async () => {
      mockRepository.findAll.mockResolvedValue(mockTickets);

      const result = await listTickets({ status: 'pending,accepted', page: 1, limit: 10 });

      expect(result.tickets).toHaveLength(2);
    });
  });

  // ======================
  // getTicketById
  // ======================

  describe('getTicketById', () => {
    it('should return ticket if found', async () => {
      mockRepository.findById.mockResolvedValue({ id: '1', title: 'Test' });

      const result = await getTicketById('1');

      expect(result).toEqual({ id: '1', title: 'Test' });
    });

    it('should return null if not found', async () => {
      mockRepository.findById.mockResolvedValue(null);

      const result = await getTicketById('non-existent');

      expect(result).toBeNull();
    });
  });
});