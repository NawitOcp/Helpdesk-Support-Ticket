import React from 'react';
import Badge from '../../../components/ui/Badge';

/**
 * Ticket Status Badge Component
 * Wrapper for Badge component specific to tickets
 */
const TicketStatusBadge = ({ status }) => {
  return <Badge status={status} />;
};

export default TicketStatusBadge;