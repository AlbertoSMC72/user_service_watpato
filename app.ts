import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Import routes
import profileRoutes from './src/routes/profileRoutes';

// Import Swagger setup
import { setupSwagger } from './src/config/swagger';

// Import BigInt helper
import { setupBigIntSerialization } from './src/utils/bigintHelper';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Setup BigInt serialization for JSON responses
setupBigIntSerialization();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Setup Swagger documentation
setupSwagger(app);

// Routes
app.use('/api/profile', profileRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Profile Microservice API is working!',
    documentation: '/api-docs',
    endpoints: {
      ownProfile: 'GET /api/profile/me/:userId',
      userProfile: 'GET /api/profile/user/:userId',
      updateProfilePicture: 'PATCH /api/profile/profile-picture/:userId',
      updateBanner: 'PATCH /api/profile/banner/:userId',
      updateProfileInfo: 'PATCH /api/profile/info/:userId'
    }
  });
});

// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', error);
  
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: error.message }),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Start server
const PORT = process.env.PORT || 3000;

const prisma = new PrismaClient();

async function startServer() {
  try {
    await prisma.$connect();
    console.log('✅ Database connection established.');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`👤 Profile endpoints available at: http://localhost:${PORT}/api/profile`);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to the database:', error);
    process.exit(1);
  }
}

startServer();