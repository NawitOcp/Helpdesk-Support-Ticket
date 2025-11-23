import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📋 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`💾 Datastore type: ${process.env.DATASTORE_TYPE || 'memory'}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});