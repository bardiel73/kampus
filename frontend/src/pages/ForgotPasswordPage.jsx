import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setMessage(data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Hata oluştu.');
    }
  };

  return (
    <div>
      <h2>Şifremi Unuttum</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error   && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Kayıtlı e-posta adresiniz" required
          value={email} onChange={e => setEmail(e.target.value)} />
        <button type="submit">Sıfırlama Bağlantısı Gönder</button>
      </form>
      <p><Link to="/login">Giriş sayfasına dön</Link></p>
    </div>
  );
}