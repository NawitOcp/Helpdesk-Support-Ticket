import { Router } from 'express';
import * as ticketController from '../controllers/tickets.controller.js';
import { validateCreateTicket, validateUpdateTicket, validateUpdateStatus } from '../validators/tickets.validator.js';

const router = Router();

// ======================
// Ticket Routes
// ======================

/**
 * GET /api/tickets
 * List all tickets with filtering, sorting, and pagination
 * Query params: status, sortBy, sortOrder, page, limit
 */
router.get('/tickets', ticketController.listTickets);

/**
 * GET /api/tickets/:id
 * Get a single ticket by ID
 */
router.get('/tickets/:id', ticketController.getTicketById);

/**
 * POST /api/tickets
 * Create a new ticket
 * Body: { title, description, contact: { name, email, phone? } }
 */
router.post('/tickets', validateCreateTicket, ticketController.createTicket);

/**
 * PUT /api/tickets/:id
 * Update ticket information (title, description, contact)
 * Body: { title?, description?, contact?: { name?, email?, phone? } }
 */
router.put('/tickets/:id', validateUpdateTicket, ticketController.updateTicket);

/**
 * PATCH /api/tickets/:id/status
 * Update ticket status only
 * Body: { status: "pending" | "accepted" | "resolved" | "rejected" }
 */
router.patch('/tickets/:id/status', validateUpdateStatus, ticketController.updateTicketStatus);

export default router;