import { useState, useEffect } from 'react';
import ticketsApiClient from './ticketsApiClient';

/**
 * Custom hook for fetching single ticket details
 * @param {string|number} id - Ticket ID
 * @returns {Object} { ticket, loading, error, refetch }
 */
const useTicketDetailQuery = (id) => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchTicket = async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await ticketsApiClient.getTicket(id);
      setTicket(response);
    } catch (err) {
      console.error('Error fetching ticket:', err);
      setError(err.message || 'Failed to fetch ticket');
      setTicket(null);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTicket();
  }, [id]);
  
  return {
    ticket,
    loading,
    error,
    refetch: fetchTicket
  };
};

export default useTicketDetailQuery;