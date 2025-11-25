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
    console.log('🔍 Fetching ticket with ID:', id);
    
    if (!id) {
      console.warn('⚠️ No ticket ID provided');
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await ticketsApiClient.getTicket(id);
      console.log('✅ Ticket fetched successfully:', response);
      
      // Handle response format - might be { data: ticket } or just ticket
      const ticketData = response.data || response;
      setTicket(ticketData);
    } catch (err) {
      console.error('❌ Error fetching ticket:', err);
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