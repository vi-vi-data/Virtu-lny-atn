import express from 'express';
import { query } from '../db.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const { category, color, season, style } = req.query;
    const conditions = ['user_id = $1'];
    const params = [req.user.id];

    if (category) {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }

    if (color) {
      params.push(color);
      conditions.push(`color = $${params.length}`);
    }

    if (season) {
      params.push(season);
      conditions.push(`season = $${params.length}`);
    }

    if (style) {
      params.push(style);
      conditions.push(`style = $${params.length}`);
    }

    const result = await query(
      `SELECT * FROM clothing_items WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC`,
      params
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { name, category, color, season, style, formality, brand, imageUrl } = req.body;

    if (!name || !category) {
      return res.status(400).json({ message: 'Name and category are required.' });
    }

    const result = await query(
      `INSERT INTO clothing_items (user_id, name, category, color, season, style, formality, brand, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        req.user.id,
        name,
        category,
        color || null,
        season || null,
        style || null,
        formality || null,
        brand || null,
        imageUrl || null
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, color, season, style, formality, brand, imageUrl } = req.body;

    const result = await query(
      `UPDATE clothing_items
       SET name = $1,
           category = $2,
           color = $3,
           season = $4,
           style = $5,
           formality = $6,
           brand = $7,
           image_url = $8
       WHERE id = $9 AND user_id = $10
       RETURNING *`,
      [name, category, color, season, style, formality, brand, imageUrl, id, req.user.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const result = await query(
      'DELETE FROM clothing_items WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    res.json({ message: 'Item deleted.' });
  } catch (error) {
    next(error);
  }
});

export default router;
