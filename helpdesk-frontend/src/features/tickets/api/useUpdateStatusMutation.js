import { useState } from 'react';
import ticketsApiClient from './ticketsApiClient';

/**
 * Custom hook for updating ticket status
 * @returns {Object} { updateStatus, loading, error }
 */
const useUpdateStatusMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const updateStatus = async (id, status) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ticketsApiClient.updateTicketStatus(id, status);
      setLoading(false);
      return response;
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.message || 'Failed to update status');
      setLoading(false);
      throw err;
    }
  };
  
  return {
    updateStatus,
    loading,
    error
  };
};

export default useUpdateStatusMutation;