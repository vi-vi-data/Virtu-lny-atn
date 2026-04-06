import { useEffect, useState } from 'react';
import { apiRequest } from '../api/client.js';
import ClothingForm from '../components/ClothingForm.jsx';
import ClothingList from '../components/ClothingList.jsx';

export default function WardrobePage() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ category: '', color: '', season: '', style: '' });

  async function loadItems(activeFilters = filters) {
    const params = new URLSearchParams(Object.entries(activeFilters).filter(([, value]) => value)).toString();
    const data = await apiRequest(`/clothes${params ? `?${params}` : ''}`);
    setItems(data);
  }

  useEffect(() => {
    loadItems().catch(console.error);
  }, []);

  async function handleDelete(id) {
    await apiRequest(`/clothes/${id}`, { method: 'DELETE' });
    loadItems();
  }

  function handleFilterChange(event) {
    setFilters((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  function resetFilters() {
    const cleared = { category: '', color: '', season: '', style: '' };
    setFilters(cleared);
    loadItems(cleared);
  }

  return (
    <main className="page">
      <section className="card recommend-hero">
        <div className="page-header">
          <div>
            <div className="panel-eyebrow">Pinterest style wardrobe</div>
            <h1 className="page-title">My Wardrobe</h1>
            <p className="page-subtitle">Pridávaj oblečenie, filtruj kúsky a buduj si prehľadný digitálny šatník v jemných ružovo-fialových tónoch.</p>
          </div>
        </div>
      </section>

      <div className="grid grid-2">
        <ClothingForm onCreated={loadItems} />

        <section className="card form-grid">
          <div>
            <div className="panel-eyebrow">Filter & curate</div>
            <h2 className="section-title">Filtrovanie kúskov</h2>
            <p className="section-copy">Vyber si len tie kúsky, ktoré práve potrebuješ pre konkrétny vibe.</p>
          </div>

          <div className="filters-grid">
            <div className="input-group">
              <label className="label">Kategória</label>
              <input name="category" placeholder="napr. dress" value={filters.category} onChange={handleFilterChange} />
            </div>
            <div className="input-group">
              <label className="label">Farba</label>
              <input name="color" placeholder="pink, black, beige..." value={filters.color} onChange={handleFilterChange} />
            </div>
            <div className="input-group">
              <label className="label">Sezóna</label>
              <input name="season" placeholder="summer, winter..." value={filters.season} onChange={handleFilterChange} />
            </div>
            <div className="input-group">
              <label className="label">Štýl</label>
              <input name="style" placeholder="casual, elegant..." value={filters.style} onChange={handleFilterChange} />
            </div>
          </div>

          <div className="actions-row">
            <button className="primary-btn" onClick={() => loadItems()}>Použiť filtre</button>
            <button className="secondary-btn" onClick={resetFilters}>Reset</button>
          </div>

          <div className="highlight-box">
            <strong>{items.length}</strong>
            <p className="note">Aktuálne zobrazených kúskov v tvojej kolekcii.</p>
          </div>
        </section>
      </div>

      <section className="card">
        <div className="split-header">
          <div>
            <h2 className="section-title">Tvoja módna nástenka</h2>
            <p className="section-copy">Klikateľný prehľad kúskov v Pinterest-like rozložení.</p>
          </div>
        </div>
        <div className="divider" />
        <ClothingList items={items} onDelete={handleDelete} />
      </section>
    </main>
  );
}
