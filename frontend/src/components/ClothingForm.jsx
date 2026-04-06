import { useState } from 'react';
import { apiRequest } from '../api/client.js';

const initialState = {
  name: '',
  category: '',
  color: '',
  season: '',
  style: '',
  formality: '',
  brand: '',
  imageUrl: ''
};

const categoryOptions = ['t-shirt', 'shirt', 'blouse', 'sweater', 'hoodie', 'jeans', 'trousers', 'skirt', 'dress', 'shoes', 'sneakers', 'boots', 'jacket', 'coat', 'bag', 'accessory'];
const seasonOptions = ['spring', 'summer', 'autumn', 'winter'];
const styleOptions = ['casual', 'elegant', 'streetwear', 'minimal', 'romantic', 'sporty', 'formal'];
const formalityOptions = ['casual', 'smart-casual', 'formal'];

export default function ClothingForm({ onCreated }) {
  const [form, setForm] = useState(initialState);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  function handleChange(event) {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      let imageUrl = form.imageUrl;

      if (file) {
        const body = new FormData();
        body.append('image', file);

        const uploadResult = await apiRequest('/upload', {
          method: 'POST',
          body
        });

        imageUrl = uploadResult.imageUrl;
      }

      await apiRequest('/clothes', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          imageUrl
        })
      });

      setForm(initialState);
      setFile(null);
      setMessage('Kúsok bol úspešne pridaný do šatníka.');
      onCreated?.();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="card form-grid" onSubmit={handleSubmit}>
      <div className="section-header">
        <div>
          <div className="panel-eyebrow">➕ Add a new piece</div>
          <h2 className="section-title">Pridaj oblečenie</h2>
          <p className="section-copy">Nahraj fotku alebo URL a vytvor si digitálny Pinterest-like šatník.</p>
        </div>
      </div>

      <div className="input-row">
        <div className="input-group">
          <label className="label">Názov kúsku</label>
          <input name="name" placeholder="napr. Pink cardigan" value={form.name} onChange={handleChange} required />
        </div>

        <div className="input-group">
          <label className="label">Kategória</label>
          <select name="category" value={form.category} onChange={handleChange} required>
            <option value="">Vyber kategóriu</option>
            {categoryOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="filters-grid">
        <div className="input-group">
          <label className="label">Farba</label>
          <input name="color" placeholder="napr. blush pink" value={form.color} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label className="label">Sezóna</label>
          <select name="season" value={form.season} onChange={handleChange}>
            <option value="">Vyber sezónu</option>
            {seasonOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label className="label">Štýl</label>
          <select name="style" value={form.style} onChange={handleChange}>
            <option value="">Vyber štýl</option>
            {styleOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label className="label">Formálnosť</label>
          <select name="formality" value={form.formality} onChange={handleChange}>
            <option value="">Vyber úroveň</option>
            {formalityOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="input-row">
        <div className="input-group">
          <label className="label">Značka</label>
          <input name="brand" placeholder="napr. Zara" value={form.brand} onChange={handleChange} />
        </div>
        <div className="input-group">
          <label className="label">URL obrázka</label>
          <input name="imageUrl" placeholder="https://..." value={form.imageUrl} onChange={handleChange} />
        </div>
      </div>

      <div className="input-group">
        <label className="label">Nahrať vlastnú fotku</label>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </div>

      <div className="actions-row">
        <button className="primary-btn" disabled={loading}>
          {loading ? 'Ukladám...' : 'Pridať do šatníka'}
        </button>
        {message && <span className="message">{message}</span>}
      </div>
    </form>
  );
}
