import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function AdDetailPage() {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const { data } = await api.get(`/ads/${id}`);
        setAd(data);
      } catch (err) {
        setError(err.response?.data?.message || 'İlan yüklenirken hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    fetchAd();
  }, [id]);

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!ad) return <p>İlan bulunamadı.</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      <Link to="/" style={{ display: 'inline-block', marginBottom: '1rem' }}>
        ← Ana Sayfaya Dön
      </Link>
      
      <h2>{ad.title}</h2>
      
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        {/* Left Column: Image */}
        <div style={{ flex: '1 1 300px' }}>
          {ad.image ? (
            <img 
              src={ad.image} 
              alt={ad.title} 
              style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }} 
            />
          ) : (
            <div style={{ 
              width: '100%', height: '300px', backgroundColor: '#eee', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' 
            }}>
              Görsel Yok
            </div>
          )}
        </div>

        {/* Right Column: Details & Contact */}
        <div style={{ flex: '2 1 300px' }}>
          <p><strong>Kategori:</strong> {ad.category}</p>
          <p><strong>Fiyat:</strong> {ad.price === 0 ? 'Ücretsiz / Bağış' : `${ad.price} TL`}</p>
          <p><strong>İlan Tarihi:</strong> {new Date(ad.createdAt).toLocaleDateString('tr-TR')}</p>
          
          <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
            <h3>İletişim Bilgileri</h3>
            <p><strong>İsim:</strong> {ad.owner?.adSoyad}</p>
            <p><strong>E-posta:</strong> <a href={`mailto:${ad.owner?.email}`}>{ad.owner?.email}</a></p>
            <p><strong>Telefon:</strong> <a href={`tel:${ad.owner?.telefon}`}>{ad.owner?.telefon}</a></p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h3>Açıklama</h3>
        <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{ad.description}</p>
      </div>
    </div>
  );
}