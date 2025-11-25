import { useState } from 'react';
import { updateTicket } from '../../../api-client/helpdeskSupportTicketManagementSystemAPI';

/**
 * Custom hook for updating ticket information using Orval generated client
 * @returns {Object} { updateTicket: function, loading, error }
 */
const useUpdateTicketMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const update = async (id, data) => {
    setLoading(true);
    setError(null);
    
    try {
      // Use Orval generated client
      const response = await updateTicket(id, data);
      setLoading(false);
      return response.data?.data || response.data;
    } catch (err) {
      console.error('Error updating ticket:', err);
      setError(err.message || 'Failed to update ticket');
      setLoading(false);
      throw err;
    }
  };
  
  return {
    updateTicket: update,
    loading,
    error
  };
};

export default useUpdateTicketMutation;
