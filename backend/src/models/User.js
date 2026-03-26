const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  adSoyad:          { type: String, required: true },
  email:            { type: String, required: true, unique: true },
  telefon:          { type: String, required: true },
  sifre:            { type: String, required: true }, // stored hashed
  rol:              { type: String, enum: ['ogrenci', 'yonetici'], default: 'ogrenci' },
  isVerified:       { type: Boolean, default: true }, // TODO: make default false in prod
  verifyToken:      { type: String },
  resetToken:       { type: String }, // password reset token
  resetTokenExpiry: { type: Date }, // token expiry (1 hour)
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);