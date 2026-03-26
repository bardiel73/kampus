require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/auth',  require('./routes/authRoutes'));
app.use('/api/ads',   require('./routes/adRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB bağlandı');
    app.listen(process.env.PORT, () =>
      console.log(`Sunucu http://localhost:${process.env.PORT} adresinde çalışıyor`)
    );
  })
  .catch(err => console.error('MongoDB bağlantı hatası:', err));