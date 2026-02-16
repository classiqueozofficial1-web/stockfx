import { Express } from 'express';
import authRoutes from './auth.routes';
import adminRoutes from './admin.routes';

export function setupRoutes(app: Express) {
  // Auth routes (public)
  app.use('/api/auth', authRoutes);

  // Admin routes (protected)
  app.use('/api/admin', adminRoutes);

  // Health check
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
  });
}
