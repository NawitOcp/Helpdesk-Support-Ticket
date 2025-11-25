import { useState } from 'react';
import { updateTicketStatus } from '../../../api-client/helpdeskSupportTicketManagementSystemAPI';

/**
 * Custom hook for updating ticket status using Orval generated client
 * @returns {Object} { updateStatus: function, loading, error }
 */
const useUpdateStatusMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const update = async (id, status) => {
    setLoading(true);
    setError(null);
    
    try {
      // Use Orval generated client
      const response = await updateTicketStatus(id, { status });
      setLoading(false);
      return response.data?.data || response.data;
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err.message || 'Failed to update status');
      setLoading(false);
      throw err;
    }
  };
  
  return {
    updateStatus: update,
    loading,
    error
  };
};

export default useUpdateStatusMutation;
