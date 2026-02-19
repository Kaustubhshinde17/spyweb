require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const clientRoutes = require('./routes/clients');
const contactRoutes = require('./routes/contacts');
const serviceRoutes = require('./routes/services');
const projectRoutes = require('./routes/projects');
const aboutRoutes = require('./routes/about');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use('/api/clients/auth', require('./routes/clientAuth'));
app.use('/api/clients', clientRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/messages', require('./routes/messages'));
app.use('/api/ai', require('./routes/ai'));
app.use('/api/services', serviceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/about', aboutRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});
// trigger restart
