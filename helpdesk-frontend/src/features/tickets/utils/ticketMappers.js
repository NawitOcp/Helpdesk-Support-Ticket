/**
 * Ticket Data Mappers
 * Transform data between API and UI formats
 */

/**
 * Format date for display (e.g., "10 Nov")
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export const formatDateShort = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'short' 
  });
};

/**
 * Format date and time for display (e.g., "10 Nov 2025, 09:20")
 * @param {string} dateString - ISO date string
 * @returns {Object} Object with date and time strings
 */
export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  
  return {
    date: date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }),
    time: date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  };
};

/**
 * Map form data to API request format
 * @param {Object} formData - Form data from UI
 * @returns {Object} Data formatted for API
 */
export const mapFormDataToApiRequest = (formData) => {
  return {
    title: formData.title,
    description: formData.description,
    contact: {
      name: formData.contactName || '',
      email: formData.contactEmail || '',
      phone: formData.contactPhone || ''
    }
  };
};

/**
 * Map API ticket data to form initial values
 * @param {Object} ticket - Ticket data from API
 * @returns {Object} Form initial values
 */
export const mapTicketToFormData = (ticket) => {
  return {
    title: ticket.title || '',
    description: ticket.description || '',
    contactName: ticket.contact?.name || '',
    contactEmail: ticket.contact?.email || '',
    contactPhone: ticket.contact?.phone || ''
  };
};

/**
 * Validate form data
 * @param {Object} formData - Form data to validate
 * @returns {Object} Object with error messages (empty if valid)
 */
export const validateTicketForm = (formData) => {
  const errors = {};
  
  // Title validation
  if (!formData.title || !formData.title.trim()) {
    errors.title = 'Title is required';
  } else if (formData.title.length > 255) {
    errors.title = 'Title must be less than 255 characters';
  }
  
  // Description validation
  if (!formData.description || !formData.description.trim()) {
    errors.description = 'Description is required';
  } else if (formData.description.length > 2000) {
    errors.description = 'Description must be less than 2000 characters';
  }
  
  // Email validation (optional but must be valid if provided)
  if (formData.contactEmail && formData.contactEmail.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.contactEmail)) {
      errors.contactEmail = 'Invalid email format';
    }
  }
  
  return errors;
};