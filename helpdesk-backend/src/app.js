import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import ticketRoutes from './api/routes/tickets.routes.js';
import { errorHandler, notFoundHandler } from './api/middlewares/errorHandler.js';

const app = express();

// ======================
// Middleware
// ======================

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH'],
  allowedHeaders: ['Content-Type']
}));

// Request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.LOG_LEVEL || 'dev'));
}

// Body parser
app.use(express.json());

// ======================
// Routes
// ======================

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api', ticketRoutes);

// ======================
// Error Handling
// ======================

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;