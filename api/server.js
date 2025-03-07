const express = require('express');
const cors = require('cors');
const serverless = require('serverless-http'); // Tambahkan ini

const app = express();

// Middleware CORS untuk mengizinkan semua origin
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Global route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Gunakan route modular untuk store
const storeRoutes = require('../routes/storeRoutes');
app.use('/store', storeRoutes);

// Jangan gunakan `app.listen`, export handler ini
module.exports = serverless(app);
