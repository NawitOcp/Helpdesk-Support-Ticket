/**
 * Ticket Status Helper Functions
 */

/**
 * Valid state transitions according to requirements
 */
export const STATUS_TRANSITIONS = {
  pending: ['accepted', 'rejected'],
  accepted: ['resolved', 'rejected'],
  resolved: [], // Final state
  rejected: []  // Final state
};

/**
 * Get valid status options for status change dropdown
 * @param {string} currentStatus - Current ticket status
 * @returns {Array} Array of status options
 */
export const getValidStatusOptions = (currentStatus) => {
  const validNextStatuses = STATUS_TRANSITIONS[currentStatus] || [];
  
  return [
    { value: currentStatus, label: currentStatus },
    ...validNextStatuses.map(status => ({
      value: status,
      label: status
    }))
  ];
};

/**
 * Check if status transition is valid
 * @param {string} fromStatus - Current status
 * @param {string} toStatus - Target status
 * @returns {boolean} True if transition is valid
 */
export const isValidStatusTransition = (fromStatus, toStatus) => {
  if (fromStatus === toStatus) return true;
  
  const validTransitions = STATUS_TRANSITIONS[fromStatus] || [];
  return validTransitions.includes(toStatus);
};

/**
 * Check if status is final (no further transitions allowed)
 * @param {string} status - Status to check
 * @returns {boolean} True if status is final
 */
export const isFinalStatus = (status) => {
  return STATUS_TRANSITIONS[status]?.length === 0;
};

/**
 * Get status color class for Tailwind CSS
 * @param {string} status - Ticket status
 * @returns {string} Tailwind color class
 */
export const getStatusColorClass = (status) => {
  const colorMap = {
    pending: 'bg-orange-500',
    accepted: 'bg-blue-500',
    resolved: 'bg-green-600',
    rejected: 'bg-red-600'
  };
  
  return colorMap[status] || 'bg-gray-500';
};