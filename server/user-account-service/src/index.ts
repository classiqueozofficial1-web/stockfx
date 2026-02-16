import express from 'express';
import { setupRoutes } from './routes/index';
import config from './config';

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Setup routes
setupRoutes(app);

// Start the server
const PORT = config.port || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});