import React from 'react';

/**
 * TicketDetailModal Component
 * 
 * Modal dialog that displays full ticket information.
 * Provides ability to view all details and close the modal.
 */
const TicketDetailModal = ({ ticket, onClose, onUpdate }) => {
  if (!ticket) return null;

  // Format date for display
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-GB', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-GB', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const createdAt = formatDateTime(ticket.createdAt);
  const updatedAt = formatDateTime(ticket.updatedAt);

  // Status badge colors
  const statusColors = {
    pending: 'bg-orange-500',
    accepted: 'bg-blue-500',
    resolved: 'bg-green-600',
    rejected: 'bg-red-600'
  };

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
      data-testid="ticket-detail-modal"
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">
                {ticket.title}
              </h2>
              <span 
                className={`${statusColors[ticket.status] || 'bg-gray-500'} text-white px-3 py-1 rounded-full text-sm font-medium`}
              >
                {ticket.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 font-mono">
              ID: {ticket.id}
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-4 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Description
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Contact Information
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Name:</span>
                <span className="text-gray-900">
                  {ticket.contact?.name || '-'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Email:</span>
                <span className="text-gray-900">
                  {ticket.contact?.email || '-'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-700">Phone:</span>
                <span className="text-gray-900">
                  {ticket.contact?.phone || '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">
                Created At
              </h3>
              <p className="text-gray-900">
                {createdAt.date}, {createdAt.time}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">
                Updated At
              </h3>
              <p className="text-gray-900">
                {updatedAt.date}, {updatedAt.time}
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              // Navigate to edit page or open edit modal
              window.location.href = `/tickets/${ticket.id}/edit`;
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketDetailModal;