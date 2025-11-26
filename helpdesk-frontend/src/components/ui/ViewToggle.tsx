/**
 * ViewToggle Component
 * Toggle button for switching between List and Board views
 * Add this to your TicketsListPage header
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const ViewToggle: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isListView = location.pathname === '/tickets';
  const isBoardView = location.pathname === '/tickets/board';

  return (
    <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-1">
      <button
        onClick={() => navigate('/tickets')}
        className={`
          px-4 py-2 rounded text-sm font-medium transition-colors
          ${isListView 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-600 hover:bg-gray-100'
          }
        `}
      >
        <svg 
          className="w-4 h-4 inline-block mr-2" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 6h16M4 10h16M4 14h16M4 18h16" 
          />
        </svg>
        List
      </button>
      
      <button
        onClick={() => navigate('/tickets/board')}
        className={`
          px-4 py-2 rounded text-sm font-medium transition-colors
          ${isBoardView 
            ? 'bg-blue-600 text-white' 
            : 'text-gray-600 hover:bg-gray-100'
          }
        `}
      >
        <svg 
          className="w-4 h-4 inline-block mr-2" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" 
          />
        </svg>
        Board
      </button>
    </div>
  );
};

export default ViewToggle;

/**
 * Usage Example:
 * 
 * In TicketsListPage.tsx, add this to the header:
 * 
 * <div className="flex items-center justify-between mb-8">
 *   <div className="flex items-center gap-4">
 *     <h1 className="text-3xl font-bold text-gray-900">Tickets</h1>
 *     <ViewToggle />  // Add this line
 *   </div>
 *   <Button onClick={() => navigate('/tickets/create')}>
 *     Create Ticket
 *   </Button>
 * </div>
 */
