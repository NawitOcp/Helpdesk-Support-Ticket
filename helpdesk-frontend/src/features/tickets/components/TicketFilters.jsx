import React from 'react';
import Dropdown from '../../../components/ui/Dropdown';
import Select from '../../../components/ui/Select';
import { STATUS_OPTIONS, SORT_OPTIONS } from '../../../config/apiConfig';

/**
 * Ticket Filters Component
 * Handles status filtering and sorting controls
 * Based on Figma design specifications
 */
const TicketFilters = ({ 
  selectedStatuses, 
  onStatusChange, 
  sortBy, 
  onSortChange,
  searchQuery,
  onSearchChange 
}) => {
  return (
    <div className="flex items-center gap-4 mb-6">
      {/* Status Filter - Multi Select */}
      <Dropdown
        options={STATUS_OPTIONS}
        value={selectedStatuses}
        onChange={onStatusChange}
        placeholder="All Statuses"
      />
      
      {/* Sort By - Single Select */}
      <Select
        options={SORT_OPTIONS}
        value={sortBy}
        onChange={onSortChange}
        placeholder="Sort by"
      />
      
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery || ''}
        onChange={(e) => onSearchChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default TicketFilters;