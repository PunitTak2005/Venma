const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Trust Render's reverse proxy for rate limiting and secure cookies
app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  'http://localhost:3257',
  'http://127.0.0.1:3257',
  'https://venma.vercel.app',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Origin is not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Request logging — dev: colorized, production: concise
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('tiny'));
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── Root route — shows a friendly API landing page instead of 404 ──────────
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'VENMA Marketplace API',
    status: 'Running',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health:     '/api/health',
      products:   '/api/products',
      vendors:    '/api/vendors',
      categories: '/api/categories',
      auth:       '/api/auth',
    },
  });
});

// ── Dedicated health endpoint (use this for Render health checks) ───────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    environment: process.env.NODE_ENV || 'development',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/public',        require('./routes/publicRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/auth',          require('./routes/authRoutes'));
app.use('/api/products',      require('./routes/productRoutes'));
app.use('/api/orders',        require('./routes/orderRoutes'));
app.use('/api/vendors',       require('./routes/vendorRoutes'));
app.use('/api/categories',    require('./routes/categoryRoutes'));
app.use('/api/reviews',       require('./routes/reviewRoutes'));
app.use('/api/coupons',       require('./routes/couponRoutes'));
app.use('/api/wishlist',      require('./routes/wishlistRoutes'));
app.use('/api/upload',        require('./routes/uploadRoutes'));
app.use('/api/payments',      require('./routes/paymentRoutes'));
app.use('/api/admin',         require('./routes/adminRoutes'));

app.use(errorHandler);

// ── Start server ─────────────────────────────────────────────────────────────
// PORT comes from Render's environment (10000). Falls back to 9006 in dev.
const PORT = process.env.PORT || 9006;
app.listen(PORT, () => {
  const env = process.env.NODE_ENV || 'development';
  console.log('');
  console.log('  ✓ VENMA API started');
  console.log(`    Environment : ${env}`);
  console.log(`    Port        : ${PORT}`);
  console.log(`    Client URL  : ${process.env.CLIENT_URL || 'http://localhost:3257'}`);
  console.log('');
});
