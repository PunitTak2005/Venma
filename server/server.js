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

// Trust Render's proxy for rate limiting and secure cookies
app.set('trust proxy', 1);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      'http://localhost:3257',
      'http://127.0.0.1:3257',
      process.env.CLIENT_URL,
    ].filter(Boolean),
    credentials: true,
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'VENMA Production API',
  });
});

// API Routes
app.use('/api/public', require('./routes/publicRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/vendors', require('./routes/vendorRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 9006;
app.listen(PORT, () => {
  console.log(`[VENMA API] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
