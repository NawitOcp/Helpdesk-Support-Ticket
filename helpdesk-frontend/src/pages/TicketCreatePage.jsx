import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import Button from '../components/ui/Button';
import TicketForm from '../features/tickets/components/TicketForm';
import useCreateTicketMutation from '../features/tickets/api/useCreateTicketMutation';
import { mapFormDataToApiRequest } from '../features/tickets/utils/ticketMappers';

/**
 * Ticket Create Page
 * Page for creating a new ticket
 * Based on Figma design specifications
 */
const TicketCreatePage = () => {
  const navigate = useNavigate();
  const { createTicket } = useCreateTicketMutation();
  
  /**
   * Handle form submission
   */
  const handleSubmit = async (formData) => {
    try {
      // Map form data to API format
      const apiData = mapFormDataToApiRequest(formData);
      
      // Create ticket
      const result = await createTicket(apiData);
      
      // Navigate to detail page
      const ticketId = result.id || result.data?.id;
      if (ticketId) {
        navigate(`/tickets/${ticketId}`);
      } else {
        navigate('/tickets');
      }
    } catch (error) {
      // Error is already logged in the hook
      throw error;
    }
  };
  
  /**
   * Handle cancel - go back to tickets list
   */
  const handleCancel = () => {
    navigate('/tickets');
  };
  
  return (
    <AppLayout>
      {/* Page Header */}
      <div className="flex items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Ticket</h1>
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
      
      {/* Ticket Form */}
      <TicketForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel="Create"
      />
    </AppLayout>
  );
};

export default TicketCreatePage;