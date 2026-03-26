import { useState } from 'react';
import api from '../services/api';

const CATEGORIES = ['Ders Notu', 'Kitap', 'Eşya', 'Özel Ders', 'Diğer'];

export default function AdForm({ onSuccess }) {
  const [form, setForm] = useState({
    title: '', description: '', category: 'Diğer', price: 0,
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    let imageUrl = '';

    // Step 1: upload the image if one was selected
    if (imageFile) {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('image', imageFile);
        const { data } = await api.post('/ads/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrl = data.imageUrl;
      } catch {
        setError('Fotoğraf yüklenemedi.');
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    // Step 2: create the ad with the image URL
    try {
      await api.post('/ads', { ...form, image: imageUrl });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Hata oluştu.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input placeholder="Başlık" required
        value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
      <textarea placeholder="Açıklama" required
        value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
      <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
      </select>
      <input type="number" placeholder="Fiyat (0 = Bağış)" min="0"
        value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
      <input type="file" accept="image/*"
        onChange={e => setImageFile(e.target.files[0])} />
      <button type="submit" disabled={uploading}>
        {uploading ? 'Yükleniyor...' : 'İlan Yayınla'}
      </button>
    </form>
  );
}