import express, { Application } from 'express';
import cors from 'cors';
import routes from './routes';
import { globalErrorHandler } from './middlewares/errorHandler';

const app: Application = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api', routes);

// Root Health Check
app.get('/', (req, res) => {
  res.send({ success: true, message: 'Server is running smoothly' });
});

// Catch-all 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global Error Handler
app.use(globalErrorHandler);
export default app;