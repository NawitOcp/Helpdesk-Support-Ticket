// API Configuration
export const API_BASE_URL = '/api';

export const API_ENDPOINTS = {
  TICKETS: '/tickets',
  TICKET_DETAIL: (id) => `/tickets/${id}`,
  TICKET_STATUS: (id) => `/tickets/${id}/status`
};

export const DEFAULT_PAGE_SIZE = 10;

export const STATUS_COLORS = {
  pending: '#F59E0B',
  accepted: '#3B82F6',
  resolved: '#16A34A',
  rejected: '#DC2626'
};

export const SORT_OPTIONS = [
  { value: 'updatedAt', label: 'Updated At' },
  { value: 'createdAt', label: 'Created At' },
  { value: 'status', label: 'Status' }
];

export const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'accepted', label: 'accepted' },
  { value: 'resolved', label: 'resolved' },
  { value: 'rejected', label: 'rejected' }
];