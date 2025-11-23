/**
 * Tickets API Integration Tests
 * 
 * Tests the full API flow using supertest.
 * Uses in-memory datastore for isolation.
 */

import request from 'supertest';
import app from '../src/app.js';
import { resetMemoryStore, createMemoryStore } from '../src/infrastructure/datastore/memoryStore.js';

// ======================
// Test Setup
// ======================

describe('Tickets API', () => {
  let createdTicketId;

  beforeEach(async () => {
    resetMemoryStore();
    const store = createMemoryStore();
    await store.init();
  });

  // ======================
  // POST /api/tickets
  // ======================

  describe('POST /api/tickets', () => {
    const validTicket = {
      title: 'Cannot login to system',
      description: 'Getting error 401 when trying to login',
      contact: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890'
      }
    };

    it('should create a ticket and return 201', async () => {
      const res = await request(app)
        .post('/api/tickets')
        .send(validTicket)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toMatchObject({
        title: validTicket.title,
        description: validTicket.description,
        status: 'pending'
      });
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.createdAt).toBeDefined();
      expect(res.body.data.updatedAt).toBeDefined();

      createdTicketId = res.body.data.id;
    });

    it('should return 400 if title is missing', async () => {
      const res = await request(app)
        .post('/api/tickets')
        .send({ description: 'Test', contact: { name: 'Test', email: 'test@test.com' } })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.errorCode).toBe('VALIDATION_ERROR');
    });

    it('should return 400 if description is missing', async () => {
      const res = await request(app)
        .post('/api/tickets')
        .send({ title: 'Test', contact: { name: 'Test', email: 'test@test.com' } })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('should return 400 if email is invalid', async () => {
      const res = await request(app)
        .post('/api/tickets')
        .send({
          title: 'Test',
          description: 'Test desc',
          contact: { name: 'Test', email: 'invalid-email' }
        })
        .expect(400);

      expect(res.body.success).toBe(false);
    });
  });

  // ======================
  // GET /api/tickets
  // ======================

  describe('GET /api/tickets', () => {
    beforeEach(async () => {
      // Seed some tickets
      const store = createMemoryStore();
      await store.seed([
        { id: '1', title: 'Ticket 1', description: 'Desc 1', contact: { name: 'A', email: 'a@a.com' }, status: 'pending', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
        { id: '2', title: 'Ticket 2', description: 'Desc 2', contact: { name: 'B', email: 'b@b.com' }, status: 'accepted', createdAt: '2025-01-02T00:00:00Z', updatedAt: '2025-01-02T00:00:00Z' },
        { id: '3', title: 'Ticket 3', description: 'Desc 3', contact: { name: 'C', email: 'c@c.com' }, status: 'resolved', createdAt: '2025-01-03T00:00:00Z', updatedAt: '2025-01-03T00:00:00Z' }
      ]);
    });

    it('should return all tickets with pagination', async () => {
      const res = await request(app)
        .get('/api/tickets')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(3);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.pagination.total).toBe(3);
    });

    it('should filter by status', async () => {
      const res = await request(app)
        .get('/api/tickets?status=pending')
        .expect(200);

      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].status).toBe('pending');
    });

    it('should filter by multiple statuses', async () => {
      const res = await request(app)
        .get('/api/tickets?status=pending,accepted')
        .expect(200);

      expect(res.body.data).toHaveLength(2);
    });

    it('should sort by createdAt ascending', async () => {
      const res = await request(app)
        .get('/api/tickets?sortBy=createdAt&sortOrder=asc')
        .expect(200);

      expect(res.body.data[0].id).toBe('1');
      expect(res.body.data[2].id).toBe('3');
    });

    it('should paginate results', async () => {
      const res = await request(app)
        .get('/api/tickets?page=1&limit=2')
        .expect(200);

      expect(res.body.data).toHaveLength(2);
      expect(res.body.pagination.page).toBe(1);
      expect(res.body.pagination.limit).toBe(2);
      expect(res.body.pagination.hasNext).toBe(true);
    });
  });

  // ======================
  // GET /api/tickets/:id
  // ======================

  describe('GET /api/tickets/:id', () => {
    beforeEach(async () => {
      const store = createMemoryStore();
      await store.create({ id: 'test-123', title: 'Test', description: 'Test', contact: { name: 'A', email: 'a@a.com' }, status: 'pending', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' });
    });

    it('should return ticket by ID', async () => {
      const res = await request(app)
        .get('/api/tickets/test-123')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe('test-123');
    });

    it('should return 404 for non-existent ticket', async () => {
      const res = await request(app)
        .get('/api/tickets/non-existent')
        .expect(404);

      expect(res.body.success).toBe(false);
      expect(res.body.errorCode).toBe('TICKET_NOT_FOUND');
    });
  });

  // ======================
  // PUT /api/tickets/:id
  // ======================

  describe('PUT /api/tickets/:id', () => {
    beforeEach(async () => {
      const store = createMemoryStore();
      await store.create({ id: 'update-test', title: 'Original', description: 'Original desc', contact: { name: 'A', email: 'a@a.com' }, status: 'pending', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' });
    });

    it('should update ticket information', async () => {
      const res = await request(app)
        .put('/api/tickets/update-test')
        .send({ title: 'Updated Title', description: 'Updated description' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Updated Title');
      expect(res.body.data.description).toBe('Updated description');
      expect(res.body.data.status).toBe('pending'); // Status unchanged
    });

    it('should return 404 for non-existent ticket', async () => {
      const res = await request(app)
        .put('/api/tickets/non-existent')
        .send({ title: 'Updated' })
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  // ======================
  // PATCH /api/tickets/:id/status
  // ======================

  describe('PATCH /api/tickets/:id/status', () => {
    beforeEach(async () => {
      const store = createMemoryStore();
      await store.seed([
        { id: 'pending-ticket', title: 'Pending', description: 'Desc', contact: { name: 'A', email: 'a@a.com' }, status: 'pending', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
        { id: 'accepted-ticket', title: 'Accepted', description: 'Desc', contact: { name: 'B', email: 'b@b.com' }, status: 'accepted', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' },
        { id: 'resolved-ticket', title: 'Resolved', description: 'Desc', contact: { name: 'C', email: 'c@c.com' }, status: 'resolved', createdAt: '2025-01-01T00:00:00Z', updatedAt: '2025-01-01T00:00:00Z' }
      ]);
    });

    // Valid transitions
    it('should allow pending → accepted', async () => {
      const res = await request(app)
        .patch('/api/tickets/pending-ticket/status')
        .send({ status: 'accepted' })
        .expect(200);

      expect(res.body.data.status).toBe('accepted');
    });

    it('should allow pending → rejected', async () => {
      const res = await request(app)
        .patch('/api/tickets/pending-ticket/status')
        .send({ status: 'rejected' })
        .expect(200);

      expect(res.body.data.status).toBe('rejected');
    });

    it('should allow accepted → resolved', async () => {
      const res = await request(app)
        .patch('/api/tickets/accepted-ticket/status')
        .send({ status: 'resolved' })
        .expect(200);

      expect(res.body.data.status).toBe('resolved');
    });

    it('should allow accepted → rejected', async () => {
      const res = await request(app)
        .patch('/api/tickets/accepted-ticket/status')
        .send({ status: 'rejected' })
        .expect(200);

      expect(res.body.data.status).toBe('rejected');
    });

    // Invalid transitions
    it('should reject pending → resolved (invalid)', async () => {
      const res = await request(app)
        .patch('/api/tickets/pending-ticket/status')
        .send({ status: 'resolved' })
        .expect(422);

      expect(res.body.success).toBe(false);
      expect(res.body.errorCode).toBe('INVALID_STATUS_TRANSITION');
    });

    it('should reject resolved → any (final state)', async () => {
      const res = await request(app)
        .patch('/api/tickets/resolved-ticket/status')
        .send({ status: 'pending' })
        .expect(422);

      expect(res.body.success).toBe(false);
      expect(res.body.errorCode).toBe('INVALID_STATUS_TRANSITION');
    });

    it('should return 400 for invalid status value', async () => {
      const res = await request(app)
        .patch('/api/tickets/pending-ticket/status')
        .send({ status: 'invalid-status' })
        .expect(400);

      expect(res.body.success).toBe(false);
    });

    it('should return 404 for non-existent ticket', async () => {
      const res = await request(app)
        .patch('/api/tickets/non-existent/status')
        .send({ status: 'accepted' })
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  // ======================
  // DELETE (Not Allowed)
  // ======================

  describe('DELETE /api/tickets/:id', () => {
    it('should return 404 (route not defined)', async () => {
      await request(app)
        .delete('/api/tickets/any-id')
        .expect(404);
    });
  });
});