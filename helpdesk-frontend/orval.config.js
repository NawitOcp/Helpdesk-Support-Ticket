/**
 * Orval Configuration
 * 
 * Configuration file for Orval to generate API client with custom axios instance
 */

module.exports = {
  helpdeskAPI: {
    input: './openapi.yaml',
    output: {
      mode: 'single',
      target: './src/api-client/helpdeskSupportTicketManagementSystemAPI.ts',
      client: 'axios',
      override: {
        mutator: {
          path: './src/config/axiosInstance.js',
          name: 'axiosInstance',
        },
      },
    },
  },
};