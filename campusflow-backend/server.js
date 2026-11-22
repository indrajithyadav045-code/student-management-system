import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/db.js';
import studentRoutes from './routes/studentRoutes.js';
import { notFoundHandler } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// =====================================================================
// Global Middleware
// =====================================================================

// 1. Cross-Origin Resource Sharing (CORS)
const allowedOrigin = process.env.CLIENT_ORIGIN || '*';
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 2. Request Parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// 3. Request Logger (Development mode)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[HTTP] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// =====================================================================
// API Routes
// =====================================================================

// Root documentation greeting
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to CampusFlow Student Management REST API',
    version: '1.0.0',
    documentation: {
      health: 'GET /api/health (Liveness Probe)',
      ready: 'GET /api/ready (Database Readiness Probe)',
      students: 'GET /api/students',
      studentById: 'GET /api/students/:id',
      createStudent: 'POST /api/students',
      updateStudent: 'PUT /api/students/:id',
      deleteStudent: 'DELETE /api/students/:id'
    }
  });
});

// Mount Student API Routes under /api
app.use('/api', studentRoutes);

// =====================================================================
// Error Handling Middleware
// =====================================================================

// 404 Route Not Found
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

// =====================================================================
// Server Initialization
// =====================================================================

const startServer = async () => {
  // Test MySQL connectivity
  await testConnection();

  app.listen(PORT, () => {
    console.log('====================================================');
    console.log(`🚀 CampusFlow Backend Server running on port ${PORT}`);
    console.log(`📍 Local URL: http://localhost:${PORT}`);
    console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🎓 Students endpoint: http://localhost:${PORT}/api/students`);
    console.log('====================================================');
  });
};

// Check if this script was executed directly from CLI (node server.js)
const isMainModule = process.argv[1] && (
  process.argv[1].endsWith('server.js') || 
  process.argv[1].endsWith('server')
);

if (isMainModule && process.env.NODE_ENV !== 'test') {
  startServer();
}

export { app, startServer };
export default app;
