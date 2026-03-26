import { Link } from 'react-router-dom';

export default function AdCard({ ad }) {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
      {ad.image && (
        <img src={ad.image} alt={ad.title}
          style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
      )}
      <h3>{ad.title}</h3>
      <p>{ad.category}</p>
      <p><strong>{ad.price === 0 ? 'Ücretsiz / Bağış' : `${ad.price} TL`}</strong></p>
      <Link to={`/ads/${ad._id}`}>Detay →</Link>
    </div>
  );
}