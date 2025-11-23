import { useState } from 'react';
import ticketsApiClient from './ticketsApiClient';

/**
 * Custom hook for updating ticket information
 * @returns {Object} { updateTicket, loading, error }
 */
const useUpdateTicketMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const updateTicket = async (id, data) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ticketsApiClient.updateTicket(id, data);
      setLoading(false);
      return response;
    } catch (err) {
      console.error('Error updating ticket:', err);
      setError(err.message || 'Failed to update ticket');
      setLoading(false);
      throw err;
    }
  };
  
  return {
    updateTicket,
    loading,
    error
  };
};

export default useUpdateTicketMutation;