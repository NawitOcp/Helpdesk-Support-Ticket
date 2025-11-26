/**
 * Kanban Routes
 * Routes for Kanban board operations (Simplified - No Validation)
 */

import { Router } from 'express';
import * as kanbanController from '../controllers/kanban.controller.js';

const router = Router();

/**
 * PATCH /api/tickets/reorder
 * Reorder tickets within a column
 * 
 * Request Body:
 * {
 *   "column": "pending",
 *   "orderedIds": ["id1", "id2", "id3"]
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Tickets reordered successfully"
 * }
 */
router.patch('/tickets/reorder', kanbanController.reorderTickets);

/**
 * PATCH /api/tickets/:id/status
 * Update ticket status with position
 * 
 * Request Body:
 * {
 *   "status": "accepted",
 *   "position": 2000
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "Ticket status updated to 'accepted'",
 *   "data": { ...ticket }
 * }
 */
router.patch('/tickets/:id/status', kanbanController.updateTicketStatusWithPosition);

export default router;