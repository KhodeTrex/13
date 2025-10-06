import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { pool } from '../lib/db.js';
import { requireAuth } from './auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.get('/', async (req, res) => {
  const categoryId = req.query.categoryId ? Number(req.query.categoryId) : null;
  try {
    const params = [];
    let sql = `
      SELECT f.id, f.original_name, f.stored_name, f.mime_type, f.size_bytes, f.created_at,
             f.category_id, c.name AS category_name
      FROM files f
      LEFT JOIN categories c ON c.id = f.category_id
    `;
    if (categoryId) {
      sql += ' WHERE f.category_id = $1';
      params.push(categoryId);
    }
    sql += ' ORDER BY f.created_at DESC';
    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'failed to list files' });
  }
});

router.get('/:id/download', async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ message: 'invalid id' });
  try {
    const { rows } = await pool.query('SELECT * FROM files WHERE id = $1', [id]);
    if (!rows[0]) return res.status(404).json({ message: 'file not found' });
    const file = rows[0];
    const absolutePath = path.resolve(file.storage_path);
    if (!absolutePath.startsWith(path.resolve(uploadsDir))) {
      return res.status(400).json({ message: 'invalid file path' });
    }
    res.download(absolutePath, file.original_name);
  } catch (err) {
    res.status(500).json({ message: 'failed to download file' });
  }
});

router.post('/upload', requireAuth, upload.single('file'), async (req, res) => {
  const categoryId = req.body.categoryId ? Number(req.body.categoryId) : null;
  if (!req.file) return res.status(400).json({ message: 'file is required' });
  try {
    const storedPath = path.resolve(req.file.path);
    const { rows } = await pool.query(
      `INSERT INTO files (original_name, stored_name, mime_type, size_bytes, storage_path, category_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, original_name, stored_name, mime_type, size_bytes, storage_path, category_id, created_at`,
      [
        req.file.originalname,
        req.file.filename,
        req.file.mimetype,
        req.file.size,
        storedPath,
        categoryId || null,
      ]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'failed to save file' });
  }
});

export default router;
