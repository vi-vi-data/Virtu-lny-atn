import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { query } from '../db.js';

const router = express.Router();

router.post('/:outfitId', requireAuth, async (req, res, next) => {
  try {
    await query(
      `INSERT INTO favorites (user_id, outfit_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, outfit_id) DO NOTHING`,
      [req.user.id, req.params.outfitId]
    );

    res.status(201).json({ message: 'Outfit added to favorites.' });
  } catch (error) {
    next(error);
  }
});

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT o.*
       FROM favorites f
       JOIN outfits o ON o.id = f.outfit_id
       WHERE f.user_id = $1
       ORDER BY f.created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

export default router;
