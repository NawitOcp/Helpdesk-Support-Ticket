import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Header Bar Component
 * Application header with logo and user info
 * Based on Figma design specifications
 */
const HeaderBar = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
      <Link to="/tickets" className="flex items-center gap-2">
        <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="4" width="18" height="16" rx="2" stroke="#3B82F6" strokeWidth="2"/>
            <path d="M3 8H21" stroke="#3B82F6" strokeWidth="2"/>
            <circle cx="12" cy="14" r="2" fill="#3B82F6"/>
          </svg>
        </div>
      </Link>
      
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="8" cy="5" r="3" fill="white"/>
            <path d="M2 14C2 11 5 9 8 9C11 9 14 11 14 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="text-gray-900 font-medium">User_Name</span>
      </div>
    </header>
  );
};

export default HeaderBar;