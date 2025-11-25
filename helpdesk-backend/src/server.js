import 'dotenv/config';
import app from './app.js';
import { initDatastore } from './infrastructure/datastore/index.js';
import config from './config/env.js';

const PORT = config.port;

// Initialize datastore and start server
const startServer = async () => {
  try {
    // Initialize datastore
    await initDatastore();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📋 API endpoints available at http://localhost:${PORT}/api`);
      console.log(`💾 Datastore type: ${config.datastoreType}`);
      console.log(`🌍 Environment: ${config.nodeEnv}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

startServer();