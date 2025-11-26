/**
 * Backend Handlers for Kanban Board
 * 
 * Node.js/Express handlers with status transition validation
 * and position tracking support.
 * 
 * These handlers should be added to your existing Express app.
 */

import express from 'express';

// ======================
// Constants
// ======================

const VALID_TRANSITIONS = {
  pending: ['accepted', 'rejected'],
  accepted: ['resolved', 'rejected'],
  resolved: [], // Final state
  rejected: []  // Final state
};

const VALID_STATUSES = ['pending', 'accepted', 'resolved', 'rejected'];

// ======================
// Helper Functions
// ======================

/**
 * Validate status transition
 * @param {string} currentStatus - Current ticket status
 * @param {string} newStatus - Target status
 * @returns {{ valid: boolean, error: string|null }}
 */
function validateStatusTransition(currentStatus, newStatus) {
  // Check if new status is valid
  if (!VALID_STATUSES.includes(newStatus)) {
    return {
      valid: false,
      error: `Invalid status '${newStatus}'. Must be one of: ${VALID_STATUSES.join(', ')}`
    };
  }
  
  // Check if transition is allowed
  const allowedTransitions = VALID_TRANSITIONS[currentStatus];
  
  if (!allowedTransitions.includes(newStatus)) {
    const allowed = allowedTransitions.length 
      ? allowedTransitions.join(', ') 
      : 'none (final state)';
    
    return {
      valid: false,
      error: `Cannot transition from '${currentStatus}' to '${newStatus}'. Allowed transitions: ${allowed}`
    };
  }
  
  return { valid: true, error: null };
}

// ======================
// Route Handlers
// ======================

/**
 * PATCH /api/tickets/:id/status
 * 
 * Update ticket status with validation
 * Body: { status: string, position?: number }
 */
export const updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status: newStatus, position } = req.body;
    
    // Validate request body
    if (!newStatus) {
      return res.status(400).json({
        success: false,
        errorCode: 'VALIDATION_ERROR',
        message: 'Status is required'
      });
    }
    
    // Find ticket (pseudo-code - replace with actual DB query)
    const ticket = await ticketRepository.findById(id);
    
    if (!ticket) {
      return res.status(404).json({
        success: false,
        errorCode: 'TICKET_NOT_FOUND',
        message: `Ticket with ID '${id}' not found`
      });
    }
    
    const currentStatus = ticket.status;
    
    // Validate status transition
    const validation = validateStatusTransition(currentStatus, newStatus);
    
    if (!validation.valid) {
      return res.status(422).json({
        success: false,
        errorCode: 'INVALID_STATUS_TRANSITION',
        message: validation.error
      });
    }
    
    // Update ticket status
    const updatedTicket = await ticketRepository.update(id, {
      status: newStatus,
      updatedAt: new Date().toISOString(),
      // Update position if provided
      ...(position !== undefined && { position })
    });
    
    // Log status change for audit
    await auditLog.log({
      action: 'STATUS_CHANGE',
      ticketId: id,
      from: currentStatus,
      to: newStatus,
      userId: req.user?.id, // If authentication is implemented
      timestamp: new Date().toISOString()
    });
    
    res.status(200).json({
      success: true,
      message: `Ticket status updated to '${newStatus}'`,
      data: updatedTicket
    });
    
  } catch (error) {
    console.error('Error updating ticket status:', error);
    
    res.status(500).json({
      success: false,
      errorCode: 'INTERNAL_ERROR',
      message: 'Failed to update ticket status'
    });
  }
};

/**
 * PATCH /api/tickets/reorder
 * 
 * Update ticket positions within a column (optional feature)
 * Body: { status: string, orderedIds: string[] }
 */
export const reorderTickets = async (req, res) => {
  try {
    const { status, orderedIds } = req.body;
    
    // Validate request body
    if (!status || !Array.isArray(orderedIds)) {
      return res.status(400).json({
        success: false,
        errorCode: 'VALIDATION_ERROR',
        message: 'Status and orderedIds (array) are required'
      });
    }
    
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        errorCode: 'INVALID_STATUS',
        message: `Invalid status '${status}'`
      });
    }
    
    // Start transaction (if using SQL database)
    // await db.beginTransaction();
    
    try {
      // Update position for each ticket in the order
      for (let i = 0; i < orderedIds.length; i++) {
        const ticketId = orderedIds[i];
        
        // Verify ticket exists and has correct status
        const ticket = await ticketRepository.findById(ticketId);
        
        if (!ticket) {
          // Skip non-existent tickets or log warning
          console.warn(`Ticket ${ticketId} not found during reorder`);
          continue;
        }
        
        if (ticket.status !== status) {
          // Ticket is in wrong column - skip or error
          console.warn(`Ticket ${ticketId} has status ${ticket.status}, expected ${status}`);
          continue;
        }
        
        // Update position
        await ticketRepository.update(ticketId, {
          position: i,
          updatedAt: new Date().toISOString()
        });
      }
      
      // Commit transaction
      // await db.commit();
      
      res.status(200).json({
        success: true,
        message: 'Tickets reordered successfully'
      });
      
    } catch (error) {
      // Rollback transaction on error
      // await db.rollback();
      throw error;
    }
    
  } catch (error) {
    console.error('Error reordering tickets:', error);
    
    res.status(500).json({
      success: false,
      errorCode: 'INTERNAL_ERROR',
      message: 'Failed to reorder tickets'
    });
  }
};

/**
 * GET /api/tickets
 * 
 * List tickets with optional sorting by position
 * This is an enhancement to existing endpoint
 */
export const listTickets = async (req, res) => {
  try {
    const { status, sortBy, sortOrder, page = 1, limit = 10 } = req.query;
    
    // Build query
    let query = {};
    
    if (status) {
      const statuses = Array.isArray(status) ? status : status.split(',');
      query.status = { $in: statuses };
    }
    
    // Determine sort field
    let sort = {};
    
    if (sortBy === 'position') {
      // Sort by position (for Kanban view)
      sort.position = sortOrder === 'asc' ? 1 : -1;
      // Secondary sort by updatedAt for ties
      sort.updatedAt = -1;
    } else if (sortBy === 'createdAt') {
      sort.createdAt = sortOrder === 'asc' ? 1 : -1;
    } else {
      // Default: sort by updatedAt descending
      sort.updatedAt = -1;
    }
    
    // Execute query with pagination
    const tickets = await ticketRepository.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    
    const total = await ticketRepository.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: tickets,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
    
  } catch (error) {
    console.error('Error listing tickets:', error);
    
    res.status(500).json({
      success: false,
      errorCode: 'INTERNAL_ERROR',
      message: 'Failed to list tickets'
    });
  }
};

// ======================
// Middleware for Validation
// ======================

/**
 * Validate status update request
 */
export const validateStatusUpdate = (req, res, next) => {
  const { status } = req.body;
  
  if (!status) {
    return res.status(400).json({
      success: false,
      errorCode: 'VALIDATION_ERROR',
      message: 'Status is required',
      errors: [{ field: 'status', message: 'Status is required' }]
    });
  }
  
  if (typeof status !== 'string') {
    return res.status(400).json({
      success: false,
      errorCode: 'VALIDATION_ERROR',
      message: 'Status must be a string',
      errors: [{ field: 'status', message: 'Must be a string' }]
    });
  }
  
  next();
};

/**
 * Validate reorder request
 */
export const validateReorderRequest = (req, res, next) => {
  const { status, orderedIds } = req.body;
  
  const errors = [];
  
  if (!status) {
    errors.push({ field: 'status', message: 'Status is required' });
  }
  
  if (!orderedIds) {
    errors.push({ field: 'orderedIds', message: 'orderedIds is required' });
  } else if (!Array.isArray(orderedIds)) {
    errors.push({ field: 'orderedIds', message: 'orderedIds must be an array' });
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errorCode: 'VALIDATION_ERROR',
      message: 'Validation failed',
      errors
    });
  }
  
  next();
};

// ======================
// Route Registration
// ======================

/**
 * Register routes in Express app
 */
export const registerKanbanRoutes = (app) => {
  // Update ticket status
  app.patch(
    '/api/tickets/:id/status',
    validateStatusUpdate,
    updateTicketStatus
  );
  
  // Reorder tickets (optional)
  app.patch(
    '/api/tickets/reorder',
    validateReorderRequest,
    reorderTickets
  );
  
  // List tickets (already exists, but enhanced)
  app.get('/api/tickets', listTickets);
};

// ======================
// Database Schema Enhancement
// ======================

/**
 * Suggested MongoDB Schema with position field
 * 
 * {
 *   id: String (UUID),
 *   title: String (required, max 255),
 *   description: String (required, max 2000),
 *   contact: {
 *     name: String,
 *     email: String,
 *     phone: String (optional)
 *   },
 *   status: String (enum: pending, accepted, resolved, rejected),
 *   position: Number (default: 0, for ordering within column),
 *   createdAt: Date,
 *   updatedAt: Date
 * }
 * 
 * Indexes:
 * - { status: 1, position: 1 } - For efficient Kanban queries
 * - { updatedAt: -1 } - For default list sorting
 * - { createdAt: -1 } - For created date sorting
 */

/**
 * Suggested SQL Schema with position field
 * 
 * CREATE TABLE tickets (
 *   id VARCHAR(36) PRIMARY KEY,
 *   title VARCHAR(255) NOT NULL,
 *   description TEXT NOT NULL,
 *   contact_name VARCHAR(255),
 *   contact_email VARCHAR(255),
 *   contact_phone VARCHAR(50),
 *   status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'accepted', 'resolved', 'rejected')),
 *   position INTEGER DEFAULT 0,
 *   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 *   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 *   
 *   INDEX idx_status_position (status, position),
 *   INDEX idx_updated_at (updated_at DESC),
 *   INDEX idx_created_at (created_at DESC)
 * );
 */

export default {
  updateTicketStatus,
  reorderTickets,
  listTickets,
  validateStatusUpdate,
  validateReorderRequest,
  registerKanbanRoutes
};