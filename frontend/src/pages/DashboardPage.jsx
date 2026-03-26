import { useEffect, useState } from 'react';
import api from '../services/api';
import AdForm from '../components/AdForm';

export default function DashboardPage() {
  const [myAds, setMyAds] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchMyAds = async () => {
    // Fetch all ads then filter client-side by owner (simple approach for school project)
    const { data } = await api.get('/ads');
    const userId = JSON.parse(localStorage.getItem('user')).id;
    setMyAds(data.filter(ad => ad.owner._id === userId));
  };

  useEffect(() => { fetchMyAds(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('İlanı silmek istediğinize emin misiniz?')) return;
    await api.delete(`/ads/${id}`);
    fetchMyAds();
  };

  return (
    <div>
      <h2>İlanlarım</h2>
      <button onClick={() => setShowForm(!showForm)}>
        {showForm ? 'İptal' : 'Yeni İlan Ekle'}
      </button>

      {showForm && <AdForm onSuccess={() => { setShowForm(false); fetchMyAds(); }} />}

      {myAds.map(ad => (
        <div key={ad._id} style={{ border: '1px solid #ccc', padding: '1rem', margin: '0.5rem 0' }}>
          <h3>{ad.title}</h3>
          <p>{ad.category} — {ad.price === 0 ? 'Bağış' : `${ad.price} TL`}</p>
          <button onClick={() => handleDelete(ad._id)}>Sil</button>
        </div>
      ))}
    </div>
  );
}