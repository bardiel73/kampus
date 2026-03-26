import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [sifre, setSifre] = useState('');
  const [tekrar, setTekrar] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (sifre !== tekrar) {
      setError('Şifreler eşleşmiyor.');
      return;
    }
    try {
      await api.post(`/auth/reset-password/${token}`, { sifre });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Geçersiz veya süresi dolmuş bağlantı.');
    }
  };

  return (
    <div>
      <h2>Yeni Şifre Belirle</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="password" placeholder="Yeni şifre" required minLength={6}
          value={sifre} onChange={e => setSifre(e.target.value)} />
        <input type="password" placeholder="Yeni şifre (tekrar)" required
          value={tekrar} onChange={e => setTekrar(e.target.value)} />
        <button type="submit">Şifreyi Sıfırla</button>
      </form>
    </div>
  );
}