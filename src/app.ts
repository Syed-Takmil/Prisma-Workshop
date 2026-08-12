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

// Global Error Handler (Must be registered last)
app.use(globalErrorHandler);

export default app;