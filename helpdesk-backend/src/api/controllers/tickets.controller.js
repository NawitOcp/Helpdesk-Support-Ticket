import * as ticketService from '../../application/services/tickets.service.js';
import { AppError } from '../../application/errors/AppError.js';

/**
 * GET /api/tickets
 * List tickets with filtering, sorting, and pagination
 */
export const listTickets = async (req, res, next) => {
  try {
    const query = {
      status: req.query.status,
      sortBy: req.query.sortBy || 'updatedAt',
      sortOrder: req.query.sortOrder || 'desc',
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10
    };

    const result = await ticketService.listTickets(query);

    res.status(200).json({
      success: true,
      data: result.tickets,
      pagination: result.pagination
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/tickets/:id
 * Get single ticket by ID
 */
export const getTicketById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const ticket = await ticketService.getTicketById(id);

    if (!ticket) {
      throw new AppError('TICKET_NOT_FOUND', `Ticket with ID '${id}' not found`, 404);
    }

    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/tickets
 * Create a new ticket
 */
export const createTicket = async (req, res, next) => {
  try {
    const payload = {
      title: req.body.title,
      description: req.body.description,
      contact: {
        name: req.body.contact?.name,
        email: req.body.contact?.email,
        phone: req.body.contact?.phone
      }
    };

    const ticket = await ticketService.createTicket(payload);

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      data: ticket
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/tickets/:id
 * Update ticket information
 */
export const updateTicket = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = {};

    if (req.body.title !== undefined) payload.title = req.body.title;
    if (req.body.description !== undefined) payload.description = req.body.description;
    if (req.body.contact !== undefined) payload.contact = req.body.contact;

    const ticket = await ticketService.updateTicket(id, payload);

    if (!ticket) {
      throw new AppError('TICKET_NOT_FOUND', `Ticket with ID '${id}' not found`, 404);
    }

    res.status(200).json({
      success: true,
      message: 'Ticket updated successfully',
      data: ticket
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/tickets/:id/status
 * Update ticket status
 */
export const updateTicketStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status: newStatus } = req.body;

    const ticket = await ticketService.updateTicketStatus(id, newStatus);

    if (!ticket) {
      throw new AppError('TICKET_NOT_FOUND', `Ticket with ID '${id}' not found`, 404);
    }

    res.status(200).json({
      success: true,
      message: `Ticket status updated to '${newStatus}'`,
      data: ticket
    });
  } catch (err) {
    next(err);
  }
};