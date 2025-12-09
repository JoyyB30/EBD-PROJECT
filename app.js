// Load environment variables from .env
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// ===== MongoDB Connection =====
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('MONGO_URI is not defined in .env');
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// ===== Routes (one per feature) =====

// 1) Authentication (Hana)
const authRoutes = require('./routes/authentication');

// 2) Record Sales (Malak F)
const salesRoutes = require('./routes/sales');

// 3) Record Purchases (Aya)
const purchaseRoutes = require('./routes/purchases');

// 4) Loan Requests (Malak G)
const loanRequestRoutes = require('./routes/loanRequests');

// 5) Bank Dashboard (Salma)
const bankRoutes = require('./routes/bank');

// 6) Monthly Summary (Joy)
const summaryRoutes = require('./routes/summary');

// ===== Use Routes =====

app.use('/api/auth', authRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/loans', loanRequestRoutes);
app.use('/api/bank', bankRoutes);
app.use('/api/summary', summaryRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('FarmConnect API Running');
});

// Export app for server.js
module.exports = app;