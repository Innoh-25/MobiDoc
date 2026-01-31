const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
// require the internal clean function so we can sanitize in-place without reassigning req properties
const xssLib = require('xss-clean/lib/xss');
const path = require('path');

// Load environment variables
dotenv.config();

// Import database connection
const connectDB = require('./config/database');

// Import routes
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const adminRoutes = require('./routes/adminRoutes');
const consultationRoutes = require('./routes/consultationRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Initialize Express app
const app = express();

// Connect to database
connectDB();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Set security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// Sanitize data
// express-mongo-sanitize's middleware assigns back to req.query which can be a getter-only property
// in some Node/Express environments. Use the library's sanitize function to mutate objects in-place
// instead of reassigning the request property.
app.use((req, res, next) => {
  try {
    if (req.body) mongoSanitize.sanitize(req.body);
    if (req.params) mongoSanitize.sanitize(req.params);
    if (req.query) mongoSanitize.sanitize(req.query);
  } catch (err) {
    // If sanitization throws, forward to error handler
    return next(err);
  }
  next();
});

// Prevent XSS attacks
// The xss-clean middleware reassigns `req.query`/`req.body` which can cause an error in
// environments where those properties are getter-only. Sanitize values and mutate objects
// in-place instead of reassigning the request properties.
function isPlainObject(obj) {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

function mutateInPlace(orig, sanitized) {
  if (!isPlainObject(orig) || !isPlainObject(sanitized)) return;
  // remove keys that no longer exist
  Object.keys(orig).forEach((k) => {
    if (!(k in sanitized)) delete orig[k];
  });
  // set/update sanitized keys
  Object.keys(sanitized).forEach((k) => {
    orig[k] = sanitized[k];
  });
}

app.use((req, res, next) => {
  try {
    if (req.body) {
      const sanitized = xssLib.clean(req.body);
      mutateInPlace(req.body, sanitized);
    }
    if (req.params) {
      const sanitized = xssLib.clean(req.params);
      mutateInPlace(req.params, sanitized);
    }
    if (req.query) {
      const sanitized = xssLib.clean(req.query);
      mutateInPlace(req.query, sanitized);
    }
  } catch (err) {
    return next(err);
  }
  next();
});

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/consultations', consultationRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'MobiDoc API is running',
    version: '1.0.0',
    documentation: '/api-docs (coming soon)'
  });
});

// 404 handler - use pathless middleware so we don't pass an invalid pattern into the router
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handler middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});