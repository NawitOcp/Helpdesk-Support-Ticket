import React from 'react';
import TicketStatusBadge from './TicketStatusBadge';
import { formatDateShort } from '../utils/ticketMappers';

/**
 * Ticket Row Component
 * Single row in the tickets table
 * Based on Figma design specifications
 */
const TicketRow = ({ ticket, onClick }) => {
  return (
    <tr
      onClick={onClick}
      className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <td className="px-6 py-4 text-sm text-gray-900">
        {ticket.id}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {ticket.title}
      </td>
      <td className="px-6 py-4">
        <TicketStatusBadge status={ticket.status} />
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {formatDateShort(ticket.createdAt)}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900">
        {formatDateShort(ticket.updatedAt)}
      </td>
    </tr>
  );
};

export default TicketRow;