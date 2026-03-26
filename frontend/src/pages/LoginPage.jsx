import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', sifre: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', form);
      login(data.user, data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Giriş hatası.');
    }
  };

  return (
    <div>
      <h2>Giriş Yap</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="E-posta" required
          value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Şifre" required
          value={form.sifre} onChange={e => setForm({ ...form, sifre: e.target.value })} />
        <button type="submit">Giriş Yap</button>
      </form>
      <p>Hesabın yok mu? <Link to="/register">Kayıt ol</Link></p>
      <p><Link to="/forgot-password">Şifremi unuttum</Link></p>
    </div>
  );
}