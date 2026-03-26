import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function RegisterPage() {
  const [form, setForm] = useState({ adSoyad: '', email: '', telefon: '', sifre: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/register', form);
      setMessage(data.message); // e.g. "Kayıt başarılı. E-postanızı doğrulayın."
      setForm({ adSoyad: '', email: '', telefon: '', sifre: '' }); // clear form
    } catch (err) {
      setError(err.response?.data?.message || 'Kayıt sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2>Kayıt Ol</h2>
      
      {message && <div style={{ padding: '1rem', backgroundColor: '#d4edda', color: '#155724', marginBottom: '1rem', borderRadius: '4px' }}>{message}</div>}
      {error && <div style={{ padding: '1rem', backgroundColor: '#f8d7da', color: '#721c24', marginBottom: '1rem', borderRadius: '4px' }}>{error}</div>}
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input 
          type="text" 
          placeholder="Ad Soyad" 
          required 
          value={form.adSoyad} 
          onChange={e => setForm({ ...form, adSoyad: e.target.value })} 
        />
        <input 
          type="email" 
          placeholder="E-posta (@beun.edu.tr)" 
          required 
          pattern=".+@beun\.edu\.tr$"
          title="Sadece @beun.edu.tr uzantılı e-posta adresleri kabul edilmektedir."
          value={form.email} 
          onChange={e => setForm({ ...form, email: e.target.value })} 
        />
        <input 
          type="tel" 
          placeholder="Telefon Numarası" 
          required 
          value={form.telefon} 
          onChange={e => setForm({ ...form, telefon: e.target.value })} 
        />
        <input 
          type="password" 
          placeholder="Şifre (En az 6 karakter)" 
          required 
          minLength={6}
          value={form.sifre} 
          onChange={e => setForm({ ...form, sifre: e.target.value })} 
        />
        <button type="submit" disabled={loading} style={{ padding: '0.5rem', cursor: 'pointer' }}>
          {loading ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
        </button>
      </form>
      
      <p style={{ marginTop: '1rem', textAlign: 'center' }}>
        Zaten hesabın var mı? <Link to="/login">Giriş Yap</Link>
      </p>
    </div>
  );
}