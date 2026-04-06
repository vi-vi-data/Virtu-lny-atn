import { useEffect, useState } from 'react';
import { apiRequest } from '../api/client.js';
import OutfitCard from '../components/OutfitCard.jsx';

export default function OutfitsPage() {
  const [outfits, setOutfits] = useState([]);

  useEffect(() => {
    apiRequest('/outfits').then(setOutfits).catch(console.error);
  }, []);

  return (
    <main className="page">
      <section className="card recommend-hero">
        <div className="panel-eyebrow">Saved looks</div>
        <h1 className="page-title">Uložené outfity</h1>
        <p className="page-subtitle">Všetky kombinácie, ktoré si si už uložila z AI stylistu alebo vytvorila v aplikácii.</p>
      </section>

      <section className="outfit-list">
        {outfits.length ? outfits.map((outfit) => <OutfitCard key={outfit.id} outfit={outfit} />) : <div className="card empty-state">Zatiaľ nemáš uložené žiadne outfity.</div>}
      </section>
    </main>
  );
}
