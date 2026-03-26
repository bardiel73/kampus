const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  description: { type: String, required: true },
  category:    { type: String, required: true,
                 enum: ['Ders Notu', 'Kitap', 'Eşya', 'Özel Ders', 'Diğer'] },
  price:       { type: Number, required: true, default: 0 }, // 0 = donation
  image:       { type: String }, // file path or URL
  owner:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Advertisement', adSchema);