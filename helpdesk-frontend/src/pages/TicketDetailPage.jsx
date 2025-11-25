import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import TicketStatusBadge from '../features/tickets/components/TicketStatusBadge';
import useTicketDetailQuery from '../features/tickets/api/useTicketDetailQuery';
import useUpdateStatusMutation from '../features/tickets/api/useUpdateStatusMutation';
import { formatDateTime } from '../features/tickets/utils/ticketMappers';
import { getValidStatusOptions } from '../features/tickets/utils/ticketStatusHelpers';

/**
 * Ticket Detail Page
 * Displays full ticket information with status update capability
 * Based on Figma design specifications
 */
const TicketDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Debug
  console.log('📄 TicketDetailPage - ID from URL:', id);
  
  // Fetch ticket data
  const { ticket, loading, error, refetch } = useTicketDetailQuery(id);
  
  console.log('📊 Ticket data:', { ticket, loading, error });
  
  // Status update mutation
  const { updateStatus, loading: updatingStatus } = useUpdateStatusMutation();
  
  /**
   * Handle status change
   */
  const handleStatusChange = async (newStatus) => {
    if (newStatus === ticket.status) return;
    
    try {
      await updateStatus(id, newStatus);
      await refetch(); // Refresh ticket data
    } catch (err) {
      alert('Failed to update status. Please try again.');
    }
  };
  
  // Loading state
  if (loading) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading ticket...</p>
        </div>
      </AppLayout>
    );
  }
  
  // Error state
  if (error || !ticket) {
    return (
      <AppLayout>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error || 'Ticket not found'}
        </div>
        <Button 
          variant="secondary" 
          onClick={() => navigate('/tickets')}
          className="mt-4"
        >
          Back to Tickets
        </Button>
      </AppLayout>
    );
  }
  
  // Format timestamps
  const createdAt = formatDateTime(ticket.createdAt);
  const updatedAt = formatDateTime(ticket.updatedAt);
  
  // Get valid status options
  const statusOptions = getValidStatusOptions(ticket.status);
  
  return (
    <AppLayout>
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-8 flex-wrap">
        <h1 className="text-3xl font-bold text-gray-900">{ticket.title}</h1>
        <span className="text-gray-500">(ID : {ticket.id})</span>
        <TicketStatusBadge status={ticket.status} />
        <Button 
          variant="secondary" 
          onClick={() => navigate(`/tickets/${id}/edit`)}
        >
          Edit
        </Button>
        <Button 
          variant="secondary" 
          onClick={() => navigate('/tickets')}
        >
          &lt; Prev
        </Button>
      </div>
      
      {/* Description Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Description</h2>
        <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
      </div>
      
      {/* Contact Information Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 max-w-md">
        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
        
        <div className="space-y-3">
          <div className="flex gap-2">
            <span className="font-medium">Name :</span>
            <span className="text-gray-700">{ticket.contact?.name || '-'}</span>
          </div>
          
          <div className="flex gap-2">
            <span className="font-medium">Email :</span>
            <span className="text-gray-700">{ticket.contact?.email || '-'}</span>
          </div>
          
          <div className="flex gap-2">
            <span className="font-medium">Phone :</span>
            <span className="text-gray-700">{ticket.contact?.phone || '-'}</span>
          </div>
        </div>
      </div>
      
      {/* Timestamps */}
      <div className="mb-6">
        <div className="flex gap-8 text-sm flex-wrap">
          <div>
            <span className="font-medium">Created At : </span>
            <span className="text-gray-700">{createdAt.date} , {createdAt.time}</span>
          </div>
          <div>
            <span className="font-medium">Updated At : </span>
            <span className="text-gray-700">{updatedAt.date} , {updatedAt.time}</span>
          </div>
        </div>
      </div>
      
      {/* Status Change Dropdown */}
      <div className="max-w-xs">
        <Select
          options={statusOptions}
          value={ticket.status}
          onChange={handleStatusChange}
          placeholder="Select status"
        />
        {updatingStatus && (
          <p className="mt-2 text-sm text-gray-600">Updating status...</p>
        )}
      </div>
    </AppLayout>
  );
};

export default TicketDetailPage;