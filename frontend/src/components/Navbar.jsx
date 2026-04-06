import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { logout, user } = useAuth();
  const location = useLocation();

  const links = [
    ['/dashboard', 'Dashboard'],
    ['/wardrobe', 'Wardrobe'],
    ['/recommend', 'AI Stylist'],
    ['/outfits', 'Outfity'],
    ['/favorites', 'Favorites'],
    ['/calendar', 'Calendar']
  ];

  return (
    <header className="navbar">
      <div className="navbar-brand-wrap">
        <div className="brand-icon">✦</div>
        <div>
          <div className="brand-mark">Virtual Wardrobe</div>
          <div className="brand-subtitle">soft fashion planner & AI outfit studio</div>
        </div>
      </div>

      <nav className="navbar-links">
        {links.map(([to, label]) => (
          <Link key={to} to={to} className={`navbar-link ${location.pathname === to ? 'active' : ''}`}>
            {label}
          </Link>
        ))}
      </nav>

      <div className="navbar-user">
        <span className="user-pill">{user?.name || 'User'}</span>
        <button className="secondary-btn" onClick={logout}>Odhlásiť sa</button>
      </div>
    </header>
  );
}
