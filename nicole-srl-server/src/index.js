import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { connectDB } from './config/database.js';
import { models } from './models/index.js';
import { errorHandler, notFoundHandler } from './middleware/error.js';
import runMigrations from '../migrations/runner.js';
import migrations from '../migrations/index.js';

import healthRoutes from './routes/health.js';
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import clientRoutes from './routes/clients.js';
import saleRoutes from './routes/sales.js';
import userRoutes from './routes/users.js';
import categoryRoutes from './routes/categories.js';
import heroSlideRoutes from './routes/heroSlides.js';
import publicRoutes from './routes/public.js';

const app = express();

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/hero-slides', heroSlideRoutes);
app.use('/api/public', publicRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  app.listen(config.port, () => console.log(`🚀 Servidor en http://localhost:${config.port}`));

  try {
    await connectDB();
    await runMigrations(migrations, models);
  } catch (err) {
    console.error('⚠️  Error MongoDB/migraciones:', err.message);
  }
};

startServer();

export default app;
