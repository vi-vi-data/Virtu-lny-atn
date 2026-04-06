import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import clothesRoutes from './routes/clothes.js';
import uploadRoutes from './routes/upload.js';
import outfitsRoutes from './routes/outfits.js';
import favoritesRoutes from './routes/favorites.js';
import calendarRoutes from './routes/calendar.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, '..', 'uploads');

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  })
);

app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(uploadsPath));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Virtual wardrobe backend is running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/clothes', clothesRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/outfits', outfitsRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/calendar', calendarRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
