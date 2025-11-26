import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import TicketsListPage from '../pages/TicketsListPage';
import TicketDetailPage from '../pages/TicketDetailPage';
import TicketCreatePage from '../pages/TicketCreatePage';
import TicketEditPage from '../pages/TicketEditPage';
import KanbanBoardPage from '../pages/KanbanBoardPage';

/**
 * Application Router Configuration
 * Defines all routes for the application
 */
const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/tickets" replace />
  },
  {
    path: '/tickets',
    element: <TicketsListPage />
  },
  {
    path: '/tickets/create',
    element: <TicketCreatePage />
  },
  {
    path: '/tickets/:id',
    element: <TicketDetailPage />
  },
  {
    path: '/tickets/:id/edit',
    element: <TicketEditPage />
  },
  {
    path: '/tickets/board',
    element: <KanbanBoardPage />
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-gray-600 mb-4">Page not found</p>
          <a 
            href="/tickets" 
            className="text-blue-600 hover:text-blue-700 underline"
          >
            Go back to tickets
          </a>
        </div>
      </div>
    )
  }
]);

export default router;