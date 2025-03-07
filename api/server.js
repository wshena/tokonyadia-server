const express = require('express');
const cors = require('cors'); // Import CORS
const app = express();
const port = 4000;

// 🔹 Middleware CORS untuk mengizinkan semua origin
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json())

// Global route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Gunakan route modular untuk store
const storeRoutes = require('../routes/storeRoutes');
app.use('/store', storeRoutes);

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
