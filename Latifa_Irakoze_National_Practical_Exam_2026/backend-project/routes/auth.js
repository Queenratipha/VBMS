import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../config/db.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, rows[0].password_hash);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    req.session.userId = rows[0].id;
    res.json({ message: 'Login successful', username: rows[0].username });
  } catch (error) {
    res.status(500).json({ message: 'Login error', error: error.message });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ message: 'Logged out successfully' }));
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [existing] = await pool.execute('SELECT id FROM users WHERE username = ?', [username]);
    if (existing.length > 0) return res.status(400).json({ message: 'Username already exists' });

    const passwordHash = await bcrypt.hash(password, 10);
    await pool.execute('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, passwordHash]);
    res.status(201).json({ message: 'Account created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

router.post('/seed', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT id FROM users WHERE username = ?', ['admin']);
    if (rows.length > 0) return res.json({ message: 'Admin user already exists' });

    const passwordHash = await bcrypt.hash('Admin@1234', 10);
    await pool.execute('INSERT INTO users (username, password_hash) VALUES (?, ?)', ['admin', passwordHash]);
    res.json({ message: 'Admin user created', username: 'admin' });
  } catch (error) {
    res.status(500).json({ message: 'Cannot seed admin user', error: error.message });
  }
});

export default router;
