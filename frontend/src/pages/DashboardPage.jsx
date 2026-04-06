import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ clothes: 0, outfits: 0, favorites: 0, calendar: 0 });

  useEffect(() => {
    async function load() {
      try {
        const [clothes, outfits, favorites, calendar] = await Promise.all([
          apiRequest('/clothes'),
          apiRequest('/outfits'),
          apiRequest('/favorites'),
          apiRequest('/calendar')
        ]);

        setStats({
          clothes: clothes.length,
          outfits: outfits.length,
          favorites: favorites.length,
          calendar: calendar.length
        });
      } catch (error) {
        console.error(error);
      }
    }

    load();
  }, []);

  const quickLinks = [
    { to: '/wardrobe', icon: '👗', title: 'My wardrobe', text: 'Pridaj nové kúsky a vytvor si svoj módny board.' },
    { to: '/recommend', icon: '✨', title: 'AI stylist', text: 'Vygeneruj outfit podľa počasia a príležitosti.' },
    { to: '/outfits', icon: '🪄', title: 'Saved outfits', text: 'Pozri si uložené kombinácie a ich detaily.' },
    { to: '/calendar', icon: '🗓️', title: 'Planner', text: 'Naplánuj si, čo si oblečieš na konkrétny deň.' }
  ];

  return (
    <main className="page">
      <section className="card recommend-hero">
        <div className="page-header">
          <div>
            <div className="panel-eyebrow">Hi {user?.name || 'fashion lover'} ✨</div>
            <h1 className="page-title">Tvoj elegantný fashion dashboard</h1>
            <p className="page-subtitle">
              Spravuj kúsky, objavuj kombinácie a nechaj AI stylistu navrhnúť outfit, ktorý sa hodí k tvojej nálade aj počasiu.
            </p>
          </div>
        </div>
      </section>

      <section className="grid stats-grid">
        <div className="card stat-card"><div className="stat-label">Kúsky v šatníku</div><div className="stat-value">{stats.clothes}</div></div>
        <div className="card stat-card"><div className="stat-label">Uložené outfity</div><div className="stat-value">{stats.outfits}</div></div>
        <div className="card stat-card"><div className="stat-label">Obľúbené</div><div className="stat-value">{stats.favorites}</div></div>
        <div className="card stat-card"><div className="stat-label">Plány v kalendári</div><div className="stat-value">{stats.calendar}</div></div>
      </section>

      <section className="card">
        <div className="section-header">
          <div>
            <div className="panel-eyebrow">Quick actions</div>
            <h2 className="section-title">Choď rovno tam, kde chceš</h2>
            <p className="section-copy">Najčastejšie kroky pre rýchlu prácu v aplikácii.</p>
          </div>
        </div>

        <div className="quick-grid">
          {quickLinks.map((item) => (
            <Link key={item.to} to={item.to} className="quick-link">
              <div className="quick-link-icon">{item.icon}</div>
              <div>
                <strong>{item.title}</strong>
                <div className="muted">{item.text}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
