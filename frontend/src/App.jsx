import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import WardrobePage from './pages/WardrobePage.jsx';
import RecommendPage from './pages/RecommendPage.jsx';
import OutfitsPage from './pages/OutfitsPage.jsx';
import FavoritesPage from './pages/FavoritesPage.jsx';
import CalendarPage from './pages/CalendarPage.jsx';

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const { token } = useAuth();

  return (
    <div className="app-shell">
      {token && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to={token ? '/dashboard' : '/login'} replace />} />
        <Route path="/login" element={token ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/register" element={token ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/wardrobe" element={<PrivateRoute><WardrobePage /></PrivateRoute>} />
        <Route path="/recommend" element={<PrivateRoute><RecommendPage /></PrivateRoute>} />
        <Route path="/outfits" element={<PrivateRoute><OutfitsPage /></PrivateRoute>} />
        <Route path="/favorites" element={<PrivateRoute><FavoritesPage /></PrivateRoute>} />
        <Route path="/calendar" element={<PrivateRoute><CalendarPage /></PrivateRoute>} />
      </Routes>
    </div>
  );
}
