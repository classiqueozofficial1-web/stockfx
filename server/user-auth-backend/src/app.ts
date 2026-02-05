import express from 'express';
import mongoose from 'mongoose';
import { json } from 'body-parser';
import { authRoutes } from './routes/auth.routes';
import { userRoutes } from './routes/user.routes';
import { config } from './config';

const app = express();

// Middleware
app.use(json());

// Routes
app.use('/api/auth', authRoutes());
app.use('/api/users', userRoutes());

// Database connection
mongoose.connect(config.databaseUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Database connected successfully');
})
.catch(err => {
  console.error('Database connection error:', err);
});

export default app;