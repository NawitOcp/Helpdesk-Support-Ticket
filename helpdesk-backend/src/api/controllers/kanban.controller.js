/**
 * Kanban Controller
 * Additional controller for Kanban-specific operations
 */

import * as ticketService from '../../application/services/tickets.service.js';
import { AppError } from '../../application/errors/AppError.js';

/**
 * PATCH /api/tickets/reorder
 * Reorder tickets within a column
 */
export const reorderTickets = async (req, res, next) => {
  try {
    const { column, orderedIds } = req.body;

    // Validate input
    if (!column || !Array.isArray(orderedIds)) {
      throw new AppError(
        'VALIDATION_ERROR',
        'Column and orderedIds array are required',
        400
      );
    }

    // Validate status
    const validStatuses = ['pending', 'accepted', 'resolved', 'rejected'];
    if (!validStatuses.includes(column)) {
      throw new AppError(
        'VALIDATION_ERROR',
        `Invalid column: ${column}`,
        400
      );
    }

    // Call service to reorder
    await ticketService.reorderTicketsInColumn(column, orderedIds);

    res.status(200).json({
      success: true,
      message: 'Tickets reordered successfully'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Updated updateTicketStatus to handle position
 * PATCH /api/tickets/:id/status
 */
export const updateTicketStatusWithPosition = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status: newStatus, position } = req.body;

    // Update status with optional position
    const ticket = await ticketService.updateTicketStatus(
      id,
      newStatus,
      position !== undefined ? position : null
    );

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
