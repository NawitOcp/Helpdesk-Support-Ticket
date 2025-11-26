import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import Button from '../components/ui/Button';
import TicketsTable from '../features/tickets/components/TicketsTable';
import TicketFilters from '../features/tickets/components/TicketFilters';
import Pagination from '../features/tickets/components/Pagination';
import useTicketsQuery from '../features/tickets/api/useTicketsQuery';
import { DEFAULT_PAGE_SIZE } from '../config/apiConfig';

/**
 * Tickets List Page
 * Main page displaying all tickets with filtering and sorting
 * Based on Figma design specifications
 */
const TicketsListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get query parameters
  const currentPage = parseInt(searchParams.get('page') || '1');
  const selectedStatuses = searchParams.getAll('status');
  const sortBy = searchParams.get('sortBy') || 'updatedAt';
  const sortOrder = searchParams.get('sortOrder') || 'desc';
  
  // Local state for search (not synced to URL immediately)
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch tickets
  const { tickets, loading, error, totalPages } = useTicketsQuery({
    page: currentPage,
    limit: DEFAULT_PAGE_SIZE,
    status: selectedStatuses,
    sortBy,
    sortOrder
  });
  
  /**
   * Update query parameters
   */
  const updateQueryParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (key === 'status') {
        // Handle status array
        newParams.delete('status');
        if (Array.isArray(value) && value.length > 0) {
          value.forEach(status => newParams.append('status', status));
        }
      } else if (key === 'page') {
        // Always reset to page 1 when filters change, unless explicitly setting page
        if (value === 1) {
          newParams.delete('page');
        } else {
          newParams.set('page', value);
        }
      } else if (value === null || value === undefined || value === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    
    setSearchParams(newParams);
  };
  
  /**
   * Handle status filter change
   */
  const handleStatusChange = (statuses) => {
    updateQueryParams({ status: statuses, page: 1 });
  };
  
  /**
   * Handle sort change
   */
  const handleSortChange = (newSortBy) => {
    updateQueryParams({ sortBy: newSortBy, page: 1 });
  };
  
  /**
   * Handle page change
   */
  const handlePageChange = (page) => {
    updateQueryParams({ page });
  };
  
  /**
   * Handle row click - navigate to detail page
   */
  const handleRowClick = (ticketId) => {
    navigate(`/tickets/${ticketId}`);
  };
  
  return (
    <AppLayout>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Tickets</h1>
          
          {/* View Toggle - เพิ่มส่วนนี้ */}
          <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-1">
            <button
              className="px-3 py-1 rounded text-sm bg-blue-600 text-white"
            >
              List
            </button>
            <button
              onClick={() => navigate('/tickets/board')}
              className="px-3 py-1 rounded text-sm text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Board
            </button>
          </div>
        </div>
        
        <Button onClick={() => navigate('/tickets/create')}>
          Create Ticket
        </Button>
      </div>
      
      {/* Filters */}
      <TicketFilters
        selectedStatuses={selectedStatuses}
        onStatusChange={handleStatusChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}
      
      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading tickets...</p>
        </div>
      )}
      
      {/* Tickets Table */}
      {!loading && !error && (
        <>
          <TicketsTable
            tickets={tickets}
            onRowClick={handleRowClick}
          />
          
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </AppLayout>
  );
};

export default TicketsListPage;