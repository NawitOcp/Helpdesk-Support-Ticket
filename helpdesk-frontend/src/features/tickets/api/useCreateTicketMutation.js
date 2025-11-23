import { useState } from 'react';
import ticketsApiClient from './ticketsApiClient';

/**
 * Custom hook for creating a new ticket
 * @returns {Object} { createTicket, loading, error }
 */
const useCreateTicketMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const createTicket = async (data) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ticketsApiClient.createTicket(data);
      setLoading(false);
      return response;
    } catch (err) {
      console.error('Error creating ticket:', err);
      setError(err.message || 'Failed to create ticket');
      setLoading(false);
      throw err;
    }
  };
  
  return {
    createTicket,
    loading,
    error
  };
};

export default useCreateTicketMutation;