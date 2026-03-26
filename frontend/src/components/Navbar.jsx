import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1rem', 
      backgroundColor: '#f5f5f5',
      borderBottom: '1px solid #ddd'
    }}>
      <div>
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', color: '#333' }}>
          Kampüs Platformu
        </Link>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <Link to="/">Ana Sayfa</Link>
        
        {user ? (
          <>
            <Link to="/dashboard">İlanlarım</Link>
            {user.rol === 'yonetici' && (
              <Link to="/admin" style={{ color: 'darkred', fontWeight: 'bold' }}>
                Yönetici Paneli
              </Link>
            )}
            <span style={{ marginLeft: '1rem', color: '#666' }}>
              Merhaba, {user.adSoyad.split(' ')[0]}
            </span>
            <button onClick={handleLogout} style={{ cursor: 'pointer' }}>Çıkış Yap</button>
          </>
        ) : (
          <>
            <Link to="/login">Giriş Yap</Link>
            <Link to="/register">Kayıt Ol</Link>
          </>
        )}
      </div>
    </nav>
  );
}