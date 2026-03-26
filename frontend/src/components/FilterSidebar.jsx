export default function FilterSidebar({ categories, selected, onChange }) {
  return (
    <aside style={{ width: '180px' }}>
      <h4>Kategoriler</h4>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li onClick={() => onChange('')}
            style={{ cursor: 'pointer', fontWeight: !selected ? 'bold' : 'normal' }}>
          Tümü
        </li>
        {categories.map(c => (
          <li key={c} onClick={() => onChange(c)}
              style={{ cursor: 'pointer', fontWeight: selected === c ? 'bold' : 'normal' }}>
            {c}
          </li>
        ))}
      </ul>
    </aside>
  );
}