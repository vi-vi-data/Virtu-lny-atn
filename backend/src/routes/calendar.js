import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { query } from '../db.js';

const router = express.Router();

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { outfitId, plannedDate } = req.body;

    if (!outfitId || !plannedDate) {
      return res.status(400).json({ message: 'outfitId and plannedDate are required.' });
    }

    const result = await query(
      `INSERT INTO calendar_plans (user_id, outfit_id, planned_date)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [req.user.id, outfitId, plannedDate]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT cp.*, o.name AS outfit_name
       FROM calendar_plans cp
       JOIN outfits o ON o.id = cp.outfit_id
       WHERE cp.user_id = $1
       ORDER BY cp.planned_date ASC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

export default router;
