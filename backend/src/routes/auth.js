import express from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db.js';
import { signToken } from '../utils/jwt.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, preferredStyle, favoriteColors } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' });
    }

    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await query(
      `INSERT INTO users (name, email, password_hash, preferred_style, favorite_colors)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, preferred_style, favorite_colors`,
      [name, email, passwordHash, preferredStyle || null, favoriteColors || null]
    );

    const user = result.rows[0];
    const token = signToken(user);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        preferredStyle: user.preferred_style,
        favoriteColors: user.favorite_colors
      }
    });
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = signToken(user);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        preferredStyle: user.preferred_style,
        favoriteColors: user.favorite_colors
      }
    });
  } catch (error) {
    next(error);
  }
});

router.get('/profile', requireAuth, async (req, res, next) => {
  try {
    const result = await query(
      'SELECT id, name, email, preferred_style, favorite_colors, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    const user = result.rows[0];
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      preferredStyle: user.preferred_style,
      favoriteColors: user.favorite_colors,
      createdAt: user.created_at
    });
  } catch (error) {
    next(error);
  }
});

export default router;
