import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import TicketCard from './TicketCard';

/**
 * KanbanColumn Component
 * 
 * Represents a single column in the Kanban board for a specific status.
 * Acts as a droppable container for tickets with sortable items.
 */
const KanbanColumn = ({ id, title, tickets, onTicketClick }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
    data: {
      type: 'column',
      status: id
    }
  });

  // Color mapping for each status
  const statusColors = {
    pending: 'bg-orange-100 border-orange-300',
    accepted: 'bg-blue-100 border-blue-300',
    resolved: 'bg-green-100 border-green-300',
    rejected: 'bg-red-100 border-red-300'
  };

  const headerColors = {
    pending: 'bg-orange-500',
    accepted: 'bg-blue-500',
    resolved: 'bg-green-600',
    rejected: 'bg-red-600'
  };

  const ticketIds = tickets.map(ticket => ticket.id);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-lg border-2 transition-colors ${
        statusColors[id] || 'bg-gray-100 border-gray-300'
      } ${isOver ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
      data-testid={`column-${id}`}
    >
      {/* Column Header */}
      <div className={`${headerColors[id] || 'bg-gray-500'} text-white px-4 py-3 rounded-t-lg`}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{title}</h3>
          <span className="bg-white bg-opacity-30 px-2 py-1 rounded-full text-sm font-medium">
            {tickets.length}
          </span>
        </div>
      </div>

      {/* Column Content */}
      <SortableContext 
        items={ticketIds} 
        strategy={verticalListSortingStrategy}
        id={id}
      >
        <div className="flex-1 p-3 space-y-3 overflow-y-auto min-h-[200px] max-h-[calc(100vh-250px)]">
          {tickets.length === 0 ? (
            <div className="text-center text-gray-500 py-8 text-sm">
              No tickets
            </div>
          ) : (
            tickets.map(ticket => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onClick={() => onTicketClick(ticket)}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
};

export default KanbanColumn;