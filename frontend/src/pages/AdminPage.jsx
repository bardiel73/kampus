import { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminPage() {
  const [tab, setTab] = useState('users'); // 'users' | 'ads'
  const [users, setUsers] = useState([]);
  const [ads, setAds] = useState([]);

  const fetchUsers = async () => {
    const { data } = await api.get('/admin/users');
    setUsers(data);
  };

  const fetchAds = async () => {
    const { data } = await api.get('/admin/ads');
    setAds(data);
  };

  useEffect(() => { fetchUsers(); fetchAds(); }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Bu kullanıcıyı ve tüm ilanlarını silmek istiyor musunuz?')) return;
    await api.delete(`/admin/users/${id}`);
    fetchUsers();
    fetchAds(); // ads list changes too
  };

  const handleRoleChange = async (id, newRole) => {
    await api.patch(`/admin/users/${id}/role`, { rol: newRole });
    fetchUsers();
  };

  const handleDeleteAd = async (id) => {
    if (!window.confirm('İlanı silmek istiyor musunuz?')) return;
    await api.delete(`/admin/ads/${id}`);
    fetchAds();
  };

  return (
    <div>
      <h2>Yönetici Paneli</h2>

      <div>
        <button onClick={() => setTab('users')}
          style={{ fontWeight: tab === 'users' ? 'bold' : 'normal' }}>
          Kullanıcılar ({users.length})
        </button>
        <button onClick={() => setTab('ads')}
          style={{ fontWeight: tab === 'ads' ? 'bold' : 'normal', marginLeft: '1rem' }}>
          İlanlar ({ads.length})
        </button>
      </div>

      {tab === 'users' && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>Ad Soyad</th><th>E-posta</th><th>Rol</th><th>Doğrulandı</th><th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.adSoyad}</td>
                <td>{u.email}</td>
                <td>
                  <select value={u.rol} onChange={e => handleRoleChange(u._id, e.target.value)}>
                    <option value="ogrenci">Öğrenci</option>
                    <option value="yonetici">Yönetici</option>
                  </select>
                </td>
                <td>{u.isVerified ? '✓' : '✗'}</td>
                <td>
                  <button onClick={() => handleDeleteUser(u._id)} style={{ color: 'red' }}>
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {tab === 'ads' && (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>Başlık</th><th>Kategori</th><th>Fiyat</th><th>Sahibi</th><th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {ads.map(ad => (
              <tr key={ad._id}>
                <td>{ad.title}</td>
                <td>{ad.category}</td>
                <td>{ad.price === 0 ? 'Bağış' : `${ad.price} TL`}</td>
                <td>{ad.owner?.adSoyad} ({ad.owner?.email})</td>
                <td>
                  <button onClick={() => handleDeleteAd(ad._id)} style={{ color: 'red' }}>
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}