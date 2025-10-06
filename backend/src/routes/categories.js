import express from 'express';
import { pool } from '../lib/db.js';
import { requireAuth } from './auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name, created_at FROM categories ORDER BY name ASC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'failed to list categories' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  const { name } = req.body || {};
  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'name is required' });
  }
  try {
    const { rows } = await pool.query('INSERT INTO categories(name) VALUES($1) RETURNING id, name, created_at', [name.trim()]);
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ message: 'category already exists' });
    }
    res.status(500).json({ message: 'failed to create category' });
  }
});

export default router;
