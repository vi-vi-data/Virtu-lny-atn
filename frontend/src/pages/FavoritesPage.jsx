import { useEffect, useState } from 'react';
import { apiRequest } from '../api/client.js';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    apiRequest('/favorites').then(setFavorites).catch(console.error);
  }, []);

  return (
    <main className="page">
      <section className="card recommend-hero">
        <div className="panel-eyebrow">Favorite moodboard</div>
        <h1 className="page-title">Obľúbené outfity</h1>
        <p className="page-subtitle">Prehľad outfitov, ku ktorým sa chceš rýchlo vrátiť.</p>
      </section>

      <section className="card">
        {favorites.length ? (
          <div className="calendar-list">
            {favorites.map((item) => (
              <div className="list-row" key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <div className="muted">{item.occasion || 'No occasion specified'}</div>
                </div>
                <div className="chip-date">favorite</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">Zatiaľ nemáš žiadne obľúbené outfity.</div>
        )}
      </section>
    </main>
  );
}
