import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/**
 * TicketCard Component
 * 
 * Individual ticket card that can be dragged between columns.
 * Displays ticket information with visual status indicator.
 */
const TicketCard = ({ ticket, onClick, isDragging = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: ticket.id,
    data: {
      type: 'ticket',
      ticket
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Truncate text with ellipsis
  const truncate = (text, maxLength = 80) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-move ${
        isDragging ? 'shadow-lg' : ''
      }`}
      data-testid={`ticket-card-${ticket.id}`}
      onClick={(e) => {
        // Only trigger click if not dragging
        if (!isSortableDragging && onClick) {
          onClick(e);
        }
      }}
    >
      <div className="p-4">
        {/* Ticket Title */}
        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {ticket.title}
        </h4>
        
        {/* Ticket Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-3">
          {truncate(ticket.description)}
        </p>
        
        {/* Ticket Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            {/* Contact Icon */}
            {ticket.contact?.name && (
              <div className="flex items-center gap-1">
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                  />
                </svg>
                <span>{ticket.contact.name}</span>
              </div>
            )}
          </div>
          
          {/* Updated timestamp */}
          <div className="flex items-center gap-1">
            <svg 
              className="w-4 h-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <span>{formatDate(ticket.updatedAt)}</span>
          </div>
        </div>
        
        {/* Ticket ID */}
        <div className="mt-2 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-400 font-mono">
            #{ticket.id.substring(0, 8)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;