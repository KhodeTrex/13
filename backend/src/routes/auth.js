import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ message: 'username and password required' });
  }
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  if (username === adminUser && password === adminPass) {
    const token = jwt.sign({ role: 'admin', username }, process.env.JWT_SECRET || 'change_me', { expiresIn: '12h' });
    return res.json({ token });
  }
  return res.status(401).json({ message: 'invalid credentials' });
});

export function requireAuth(req, res, next) {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ message: 'missing token' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'change_me');
    if (payload.role !== 'admin') {
      return res.status(403).json({ message: 'forbidden' });
    }
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'invalid token' });
  }
}

export default router;
