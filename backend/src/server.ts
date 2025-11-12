import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { testConnection } from './config/database';
import { authMiddleware, roleMiddleware } from './middleware/auth';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import supplierRoutes from './routes/supplier';
import customerRoutes from './routes/customer';
import productRoutes from './routes/product';
import warehouseRoutes from './routes/warehouses';
import purchaseRoutes from './routes/purchase';
import salesRoutes from './routes/sales';
import reportRoutes from './routes/report';
import companyRoutes from './routes/company';
import accountsRoutes from './routes/accounts';
import journalEntriesRoutes from './routes/journalEntries';
import stockMovementsRoutes from './routes/stockMovements';
import productCategoriesRoutes from './routes/productCategories';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'جاهز', message: 'السيرفر يعمل بشكل صحيح' });
});

// Public Routes
app.use('/api/auth', authRoutes);

// Protected Routes
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/suppliers', authMiddleware, supplierRoutes);
app.use('/api/customers', authMiddleware, customerRoutes);
app.use('/api/products', authMiddleware, productRoutes);
app.use('/api/warehouses', authMiddleware, warehouseRoutes);
app.use('/api/purchases', authMiddleware, purchaseRoutes);
app.use('/api/sales', authMiddleware, salesRoutes);
app.use('/api/reports', authMiddleware, reportRoutes);
app.use('/api/company', authMiddleware, companyRoutes);
app.use('/api/accounts', authMiddleware, accountsRoutes);
app.use('/api/journal-entries', authMiddleware, journalEntriesRoutes);
app.use('/api/stock-movements', authMiddleware, stockMovementsRoutes);
app.use('/api/product-categories', authMiddleware, productCategoriesRoutes);

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'المسار غير موجود' });
});

// Error Handler
app.use((err: any, req: Request, res: Response) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'حدث خطأ في السيرفر',
  });
});

// Start Server
async function startServer() {
  try {
    await testConnection();
    app.listen(PORT, () => {
      console.log(`✓ السيرفر يعمل على المنفذ ${PORT}`);
      console.log(`✓ قم بزيارة http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('✗ فشل بدء السيرفر:', error);
    process.exit(1);
  }
}

startServer();

export default app;
