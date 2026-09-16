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

// ── CORS ─────────────────────────────────────────────────────────────────────
// Build allowed-origins list from env + known Vercel URLs.
// CLIENT_URL on Render should be set to: https://venmaclient.vercel.app
const allowedOrigins = [
  'http://localhost:3257',
  'http://127.0.0.1:3257',
  'https://venmaclient.vercel.app',   // actual production frontend
  'https://venma.vercel.app',          // alias / older deployment
  process.env.CLIENT_URL,              // whatever is set in Render env vars
].filter(Boolean).map(o => o.trim().replace(/\/$/, '')); // normalise trailing slash

const corsOptions = {
  origin(origin, callback) {
    // Allow server-to-server calls (no Origin header) and known origins
    if (!origin) return callback(null, true);
    const clean = origin.trim().replace(/\/$/, '');
    if (allowedOrigins.includes(clean)) return callback(null, true);
    // Also allow any *.vercel.app preview deployment
    if (/^https:\/\/[a-z0-9-]+(\.vercel\.app)$/i.test(clean)) return callback(null, true);
    console.warn(`[CORS] Blocked origin: ${origin}`);
    return callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// Apply CORS to all routes
app.use(cors(corsOptions));

// Handle preflight OPTIONS requests for every route before any other middleware
app.options('*', cors(corsOptions));

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Security ──────────────────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// ── Request logging ───────────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('tiny'));
}

// ── Rate limiting ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// ── Static files ──────────────────────────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── Root route ────────────────────────────────────────────────────────────────
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

// ── Health endpoint (set as Render health-check path) ─────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    environment: process.env.NODE_ENV || 'development',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
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

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 9006;
app.listen(PORT, () => {
  const env = process.env.NODE_ENV || 'development';
  console.log('');
  console.log('  ✓ VENMA API started');
  console.log(`    Environment : ${env}`);
  console.log(`    Port        : ${PORT}`);
  console.log(`    Client URL  : ${process.env.CLIENT_URL || 'http://localhost:3257'}`);
  console.log(`    CORS origins: ${allowedOrigins.join(', ')}`);
  console.log('');
});
