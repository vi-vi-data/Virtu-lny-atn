import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { query } from '../db.js';
import { recommendOutfitWithAI } from '../services/aiService.js';

const router = express.Router();

router.post('/recommend', requireAuth, async (req, res, next) => {
  try {
    const { occasion, weatherType, style, season } = req.body;

    const wardrobeResult = await query(
      'SELECT * FROM clothing_items WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );

    const items = wardrobeResult.rows;

    const recommendation = await recommendOutfitWithAI(items, {
      occasion,
      weatherType,
      style,
      season
    });

    await query(
      `INSERT INTO ai_recommendations_log (user_id, input_context, recommended_output)
       VALUES ($1, $2::jsonb, $3::jsonb)`,
      [
        req.user.id,
        JSON.stringify({ occasion, weatherType, style, season }),
        JSON.stringify(recommendation)
      ]
    );

    res.json(recommendation);
  } catch (error) {
    next(error);
  }
});

router.post('/', requireAuth, async (req, res, next) => {
  try {
    const { name, occasion, season, weatherType, aiGenerated, explanation, itemIds } = req.body;

    if (!name || !Array.isArray(itemIds) || !itemIds.length) {
      return res.status(400).json({ message: 'Name and itemIds are required.' });
    }

    const outfitResult = await query(
      `INSERT INTO outfits (user_id, name, occasion, season, weather_type, ai_generated, explanation)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.user.id, name, occasion || null, season || null, weatherType || null, !!aiGenerated, explanation || null]
    );

    const outfit = outfitResult.rows[0];

    for (const itemId of itemIds) {
      await query(
        `INSERT INTO outfit_items (outfit_id, clothing_item_id)
         VALUES ($1, $2)`,
        [outfit.id, itemId]
      );
    }

    res.status(201).json(outfit);
  } catch (error) {
    next(error);
  }
});

router.get('/', requireAuth, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT o.*,
              COALESCE(
                json_agg(
                  json_build_object(
                    'id', c.id,
                    'name', c.name,
                    'category', c.category,
                    'color', c.color,
                    'image_url', c.image_url
                  )
                ) FILTER (WHERE c.id IS NOT NULL),
                '[]'
              ) AS items
       FROM outfits o
       LEFT JOIN outfit_items oi ON oi.outfit_id = o.id
       LEFT JOIN clothing_items c ON c.id = oi.clothing_item_id
       WHERE o.user_id = $1
       GROUP BY o.id
       ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    next(error);
  }
});

export default router;
