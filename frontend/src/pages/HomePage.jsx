import { useEffect, useState } from 'react';
import api from '../services/api';
import AdCard from '../components/AdCard';
import FilterSidebar from '../components/FilterSidebar';

const CATEGORIES = ['Ders Notu', 'Kitap', 'Eşya', 'Özel Ders', 'Diğer'];

export default function HomePage() {
  const [ads, setAds] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');

  const fetchAds = async () => {
    const params = {};
    if (keyword) params.keyword = keyword;
    if (category) params.category = category;
    const { data } = await api.get('/ads', { params });
    setAds(data);
  };

  useEffect(() => { fetchAds(); }, [category]);

  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      <FilterSidebar categories={CATEGORIES} selected={category} onChange={setCategory} />
      <main style={{ flex: 1 }}>
        <div>
          <input placeholder="İlan ara..." value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchAds()} />
          <button onClick={fetchAds}>Ara</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
          {ads.map(ad => <AdCard key={ad._id} ad={ad} />)}
        </div>
      </main>
    </div>
  );
}