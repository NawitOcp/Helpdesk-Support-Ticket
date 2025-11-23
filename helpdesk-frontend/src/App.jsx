import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './routes/router';

/**
 * Main App Component
 * Root component that provides routing
 */
function App() {
  return <RouterProvider router={router} />;
}

export default App;