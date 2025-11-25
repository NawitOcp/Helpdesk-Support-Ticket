import { useState } from 'react';
import { createTicket } from '../../../api-client/helpdeskSupportTicketManagementSystemAPI';

/**
 * Custom hook for creating a new ticket using Orval generated client
 * @returns {Object} { createTicket: function, loading, error }
 */
const useCreateTicketMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const create = async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      // Use Orval generated client
      const response = await createTicket(data);
      setLoading(false);
      return response.data?.data || response.data;
    } catch (err) {
      console.error('Error creating ticket:', err);
      setError(err.message || 'Failed to create ticket');
      setLoading(false);
      throw err;
    }
  };
  
  return {
    createTicket: create,
    loading,
    error
  };
};

export default useCreateTicketMutation;
