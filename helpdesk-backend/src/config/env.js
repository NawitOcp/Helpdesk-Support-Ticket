/**
 * Environment Configuration
 * 
 * Centralizes all environment variables into a typed config object.
 * Import this instead of using process.env directly.
 */

import 'dotenv/config';

// ======================
// Config Object
// ======================

export const config = Object.freeze({
  // Server
  port: parseInt(process.env.PORT, 10) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Datastore
  datastoreType: process.env.DATASTORE_TYPE || 'memory',
  dataFilePath: process.env.DATA_FILE_PATH || './data/tickets.json',
  
  // CORS
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'dev'
});

// ======================
// Environment Helpers
// ======================

export const isDevelopment = () => config.nodeEnv === 'development';
export const isProduction = () => config.nodeEnv === 'production';
export const isTest = () => config.nodeEnv === 'test';

// ======================
// Datastore Helpers
// ======================

export const useMemoryStore = () => config.datastoreType === 'memory';
export const useFileStore = () => config.datastoreType === 'file';

// ======================
// Validation
// ======================

const validateConfig = () => {
  const errors = [];

  // Validate port
  if (isNaN(config.port) || config.port < 1 || config.port > 65535) {
    errors.push('PORT must be a valid port number (1-65535)');
  }

  // Validate datastore type
  const validDatastoreTypes = ['memory', 'file'];
  if (!validDatastoreTypes.includes(config.datastoreType)) {
    errors.push(`DATASTORE_TYPE must be one of: ${validDatastoreTypes.join(', ')}`);
  }

  // Validate file path if using file store
  if (useFileStore() && !config.dataFilePath) {
    errors.push('DATA_FILE_PATH is required when DATASTORE_TYPE is "file"');
  }

  if (errors.length > 0) {
    console.error('❌ Configuration errors:');
    errors.forEach(err => console.error(`   - ${err}`));
    process.exit(1);
  }
};

// Run validation on import (except in test)
if (!isTest()) {
  validateConfig();
}

// ======================
// Debug Helper
// ======================

export const printConfig = () => {
  console.log('📋 Configuration:');
  console.log(`   Port:          ${config.port}`);
  console.log(`   Environment:   ${config.nodeEnv}`);
  console.log(`   Datastore:     ${config.datastoreType}`);
  if (useFileStore()) {
    console.log(`   Data file:     ${config.dataFilePath}`);
  }
  console.log(`   CORS origin:   ${config.corsOrigin}`);
  console.log(`   Log level:     ${config.logLevel}`);
};

export default config;