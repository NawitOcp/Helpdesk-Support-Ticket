import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import KanbanBoard from '../features/kanban/components/KanbanBoard';

/**
 * Kanban Board Page
 * 
 * Full page wrapper for the Kanban board view.
 * Matches the existing page structure in the app.
 */
const KanbanBoardPage = () => {
  return (
    <AppLayout>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tickets Board</h1>
            <p className="text-gray-600 mt-1">Drag and drop tickets between columns</p>
          </div>
          
          {/* View Toggle Button */}
          <a 
            href="/tickets"
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg 
              className="w-5 h-5" 
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
            List View
          </a>
        </div>
      </div>
      
      <KanbanBoard />
    </AppLayout>
  );
};

export default KanbanBoardPage;