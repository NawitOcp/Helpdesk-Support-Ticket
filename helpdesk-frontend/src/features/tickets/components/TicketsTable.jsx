import React from 'react';
import TicketRow from './TicketRow';

/**
 * Tickets Table Component
 * Displays list of tickets in a table format
 * Based on Figma design specifications
 */
const TicketsTable = ({ tickets, onRowClick }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              ID
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Title
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Status
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Created At
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
              Updated At
            </th>
          </tr>
        </thead>
        <tbody>
          {tickets.length === 0 ? (
            <tr>
              <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                No tickets found
              </td>
            </tr>
          ) : (
            tickets.map((ticket) => (
              <TicketRow
                key={ticket.id}
                ticket={ticket}
                onClick={() => onRowClick(ticket.id)}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TicketsTable;