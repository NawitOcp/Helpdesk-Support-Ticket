import React from 'react';
import { getStatusColorClass } from '../../features/tickets/utils/ticketStatusHelpers';

/**
 * Status Badge Component
 * Displays ticket status with appropriate color
 * Based on Figma design specifications
 */
const Badge = ({ status }) => {
  const colorClass = getStatusColorClass(status);
  
  return (
    <span className={`${colorClass} text-white px-4 py-1 rounded-full text-sm font-medium inline-block`}>
      {status}
    </span>
  );
};

export default Badge;