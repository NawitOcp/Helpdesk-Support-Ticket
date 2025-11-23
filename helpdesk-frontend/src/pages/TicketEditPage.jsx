import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import Button from '../components/ui/Button';
import TicketForm from '../features/tickets/components/TicketForm';
import TicketStatusBadge from '../features/tickets/components/TicketStatusBadge';
import useTicketDetailQuery from '../features/tickets/api/useTicketDetailQuery';
import useUpdateTicketMutation from '../features/tickets/api/useUpdateTicketMutation';
import { mapFormDataToApiRequest, mapTicketToFormData } from '../features/tickets/utils/ticketMappers';

/**
 * Ticket Edit Page
 * Page for editing existing ticket information
 * Status cannot be edited here (use detail page)
 * Based on Figma design specifications
 */
const TicketEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Fetch ticket data
  const { ticket, loading, error } = useTicketDetailQuery(id);
  
  // Update mutation
  const { updateTicket } = useUpdateTicketMutation();
  
  /**
   * Handle form submission
   */
  const handleSubmit = async (formData) => {
    try {
      // Map form data to API format
      const apiData = mapFormDataToApiRequest(formData);
      
      // Update ticket
      await updateTicket(id, apiData);
      
      // Navigate back to detail page
      navigate(`/tickets/${id}`);
    } catch (error) {
      // Error is already logged in the hook
      throw error;
    }
  };
  
  /**
   * Handle cancel - go back to detail page
   */
  const handleCancel = () => {
    navigate(`/tickets/${id}`);
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
  
  // Map ticket data to form initial values
  const initialFormData = mapTicketToFormData(ticket);
  
  return (
    <AppLayout>
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Edit Ticket (ID : {ticket.id})
        </h1>
        <TicketStatusBadge status={ticket.status} />
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
      
      {/* Info Message */}
      <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-6">
        <p className="text-sm">
          <strong>Note:</strong> Status cannot be changed here. Use the detail page to update ticket status.
        </p>
      </div>
      
      {/* Ticket Form */}
      <TicketForm
        initialData={initialFormData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEdit={true}
        submitLabel="Save changes"
      />
    </AppLayout>
  );
};

export default TicketEditPage;