/**
 * Datastore Factory
 * 
 * Initializes and provides the configured datastore.
 * Switches between Memory and File store based on environment.
 */

import config, { useMemoryStore, useFileStore } from '../../config/env.js';
import { createMemoryStore } from './memoryStore.js';
import { createFileStore } from './fileStore.js';
import logger from '../../config/logger.js';

// ======================
// Datastore Instance
// ======================

let datastoreInstance = null;

/**
 * Initialize datastore based on configuration
 */
export const initDatastore = async () => {
  if (datastoreInstance) {
    return datastoreInstance;
  }

  try {
    if (useMemoryStore()) {
      logger.info('Initializing Memory datastore');
      datastoreInstance = createMemoryStore();
    } else if (useFileStore()) {
      logger.info('Initializing File datastore', { path: config.dataFilePath });
      datastoreInstance = createFileStore(config.dataFilePath);
    } else {
      throw new Error(`Unknown datastore type: ${config.datastoreType}`);
    }

    await datastoreInstance.init();
    logger.info('Datastore initialized successfully');
    
    return datastoreInstance;
  } catch (err) {
    logger.error('Failed to initialize datastore', { error: err.message });
    throw err;
  }
};

/**
 * Get the initialized datastore instance
 */
export const getDatastore = () => {
  if (!datastoreInstance) {
    throw new Error('Datastore not initialized. Call initDatastore() first.');
  }
  return datastoreInstance;
};

/**
 * Reset datastore (useful for testing)
 */
export const resetDatastore = () => {
  datastoreInstance = null;
};

export default { initDatastore, getDatastore, resetDatastore };