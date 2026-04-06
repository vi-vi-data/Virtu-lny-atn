import { useState } from 'react';
import { apiRequest } from '../api/client.js';
import OutfitCard from '../components/OutfitCard.jsx';

const initialForm = { occasion: '', weatherType: '', style: '', season: '' };

export default function RecommendPage() {
  const [form, setForm] = useState(initialForm);
  const [recommendation, setRecommendation] = useState(null);
  const [message, setMessage] = useState('');
  const [plannedDate, setPlannedDate] = useState('');
  const [savedOutfitId, setSavedOutfitId] = useState(null);

  function handleChange(event) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  async function handleRecommend(event) {
    event.preventDefault();
    setMessage('');
    setSavedOutfitId(null);

    try {
      const data = await apiRequest('/outfits/recommend', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      setRecommendation(data);
      if (!data.items?.length) {
        setMessage('Najprv si pridaj pár kúskov do šatníka, aby AI vedela vytvoriť outfit.');
      }
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function saveRecommendation() {
    if (!recommendation?.items?.length) return;

    try {
      const outfit = await apiRequest('/outfits', {
        method: 'POST',
        body: JSON.stringify({
          name: recommendation.name,
          occasion: form.occasion,
          season: form.season,
          weatherType: form.weatherType,
          aiGenerated: true,
          explanation: recommendation.explanation,
          itemIds: recommendation.items.map((item) => item.id)
        })
      });

      setSavedOutfitId(outfit.id);
      setMessage(`Outfit "${outfit.name}" bol uložený.`);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function addToFavorites() {
    if (!savedOutfitId) {
      setMessage('Najprv outfit ulož.');
      return;
    }
    await apiRequest(`/favorites/${savedOutfitId}`, { method: 'POST' });
    setMessage('Outfit bol pridaný do obľúbených.');
  }

  async function planLatest() {
    if (!savedOutfitId) {
      setMessage('Najprv outfit ulož.');
      return;
    }
    if (!plannedDate) {
      setMessage('Vyber dátum.');
      return;
    }
    await apiRequest('/calendar', {
      method: 'POST',
      body: JSON.stringify({ outfitId: savedOutfitId, plannedDate })
    });
    setMessage('Outfit bol naplánovaný do kalendára.');
  }

  return (
    <main className="page">
      <div className="outfit-layout">
        <form className="card form-grid" onSubmit={handleRecommend}>
          <div>
            <div className="panel-eyebrow">AI stylist studio</div>
            <h1 className="page-title">AI Screen</h1>
            <p className="page-subtitle">Vyplň kontext a nechaj AI poskladať outfit z toho, čo už vlastníš.</p>
          </div>

          <div className="input-group">
            <label className="label">Príležitosť</label>
            <input name="occasion" placeholder="school, work, coffee date..." value={form.occasion} onChange={handleChange} />
          </div>

          <div className="filters-grid">
            <div className="input-group">
              <label className="label">Počasie</label>
              <input name="weatherType" placeholder="rain, cold, hot..." value={form.weatherType} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label className="label">Štýl</label>
              <input name="style" placeholder="romantic, casual, elegant..." value={form.style} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label className="label">Sezóna</label>
              <input name="season" placeholder="spring, summer..." value={form.season} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label className="label">Dátum do kalendára</label>
              <input type="date" value={plannedDate} onChange={(e) => setPlannedDate(e.target.value)} />
            </div>
          </div>

          <button className="primary-btn">Generate outfit ✨</button>

          <div className="highlight-box">
            <strong>How it works</strong>
            <p className="note">Aplikácia pošle tvoj šatník backendu. Ten použije Gemini API alebo fallback logiku a vráti najvhodnejšiu kombináciu.</p>
          </div>
        </form>

        <section>
          {!recommendation ? (
            <div className="card recommend-hero">
              <div className="panel-eyebrow">Ready for a look?</div>
              <h2 className="section-title">Tvoje odporúčanie sa zobrazí tu</h2>
              <p className="section-copy">Najprv vyplň formulár a klikni na Generate outfit.</p>
            </div>
          ) : (
            <OutfitCard outfit={recommendation} />
          )}

          {recommendation && (
            <div className="card">
              <div className="section-header">
                <div>
                  <h2 className="section-title">Čo chceš urobiť ďalej?</h2>
                  <p className="section-copy">Ulož outfit, pridaj ho do obľúbených alebo si ho naplánuj.</p>
                </div>
              </div>

              <div className="actions-row">
                <button className="primary-btn" onClick={saveRecommendation}>Uložiť outfit</button>
                <button className="secondary-btn" onClick={addToFavorites}>Do obľúbených</button>
                <button className="ghost-btn" onClick={planLatest}>Naplánovať</button>
              </div>

              {message && <p className="message success">{message}</p>}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
