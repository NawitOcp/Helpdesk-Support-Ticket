/**
 * MSW Server Setup
 * 
 * Configures the Mock Service Worker for testing.
 * This server intercepts network requests during tests.
 */

import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Setup requests interception using the given handlers
export const server = setupServer(...handlers);