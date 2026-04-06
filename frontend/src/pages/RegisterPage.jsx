import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    preferredStyle: '',
    favoriteColors: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  function handleChange(event) {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');

    try {
      const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(form)
      });
      login(data);
      navigate('/dashboard');
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-layout">
        <section className="hero-card recommend-hero">
          <div>
            <div className="hero-eyebrow">✨ Build your vibe</div>
            <h1 className="hero-title">Create an account and turn your wardrobe into a curated fashion board.</h1>
            <p className="hero-text">
              Po registrácii si vieš ukladať oblečenie, obľúbené farby, preferovaný štýl a dostávať personalizované outfitové odporúčania.
            </p>
          </div>

          <div className="highlight-box">
            <strong>Tip:</strong>
            <p className="note">Pridaj hneď po registrácii pár kúskov s fotkami. AI bude mať z čoho vyberať a odporúčania budú lepšie.</p>
          </div>
        </section>

        <form className="card auth-card form-grid" onSubmit={handleSubmit}>
          <div>
            <div className="panel-eyebrow">New account</div>
            <h2 className="auth-title page-title">Registrácia</h2>
            <p className="page-subtitle">Založ si profil a nastav si štýl, ktorý máš rada.</p>
          </div>

          <div className="input-group">
            <label className="label">Meno</label>
            <input name="name" placeholder="Tvoje meno" value={form.name} onChange={handleChange} required />
          </div>

          <div className="input-row">
            <div className="input-group">
              <label className="label">Email</label>
              <input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label className="label">Heslo</label>
              <input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-row">
            <div className="input-group">
              <label className="label">Preferovaný štýl</label>
              <input name="preferredStyle" placeholder="romantic, casual, minimal..." value={form.preferredStyle} onChange={handleChange} />
            </div>
            <div className="input-group">
              <label className="label">Obľúbené farby</label>
              <input name="favoriteColors" placeholder="pink, lilac, white..." value={form.favoriteColors} onChange={handleChange} />
            </div>
          </div>

          <button className="primary-btn">Vytvoriť účet</button>
          {message && <p className="message error">{message}</p>}
          <p className="muted">Už máš účet? <Link to="/login"><strong>Prihlás sa</strong></Link></p>
        </form>
      </div>
    </div>
  );
}
