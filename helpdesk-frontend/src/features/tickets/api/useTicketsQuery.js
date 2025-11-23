import { useState, useEffect } from 'react';
import ticketsApiClient from './ticketsApiClient';

/**
 * Custom hook for fetching tickets list
 * @param {Object} params - Query parameters (page, status, sortBy, etc.)
 * @returns {Object} { tickets, loading, error, totalPages, refetch }
 */
const useTicketsQuery = (params = {}) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  
  const fetchTickets = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ticketsApiClient.getTickets(params);
      
      // Handle different response formats
      const ticketsData = response.tickets || response.data || [];
      const pages = response.totalPages || response.pagination?.totalPages || 1;
      
      setTickets(ticketsData);
      setTotalPages(pages);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError(err.message || 'Failed to fetch tickets');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTickets();
  }, [
    params.page, 
    params.limit, 
    params.sortBy, 
    params.sortOrder,
    JSON.stringify(params.status) // Handle array comparison
  ]);
  
  return {
    tickets,
    loading,
    error,
    totalPages,
    refetch: fetchTickets
  };
};

export default useTicketsQuery;