
import express from 'express';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';

const app = express();
const db = new sqlite3.Database('users.db');
const SECRET = 'supersecretkey';

app.use(cors());
app.use(bodyParser.json());

// Reset all users' balances to zero
app.post('/reset-balances', (req, res) => {
  db.run('UPDATE users SET balance = 0', [], function(err) {
    if (err) return res.status(500).json({ error: 'Failed to reset balances' });
    res.json({ success: true });
  });
});

// Clear and recreate users table on startup
function resetDatabase() {
  db.serialize(() => {
    db.run('DROP TABLE IF EXISTS users');
    db.run(`CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT,
      balance REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  });
}
resetDatabase();

// Register endpoint
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });
  const hash = bcrypt.hashSync(password, 10);
  db.run('INSERT INTO users (name, email, password, balance) VALUES (?, ?, ?, ?)', [name, email, hash, 0], function(err) {
    if (err) return res.status(400).json({ error: 'Email already exists' });
    // After registration, fetch the user and return a token
    db.get('SELECT * FROM users WHERE id = ?', [this.lastID], (err, user) => {
      if (err || !user) return res.status(500).json({ error: 'Registration failed' });
      const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' });
      res.json({ token });
    });
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'Invalid credentials' });
    if (!bcrypt.compareSync(password, user.password)) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});

// Dashboard endpoint
app.get('/dashboard', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    db.get('SELECT id, name, email, balance, created_at FROM users WHERE id = ?', [decoded.id], (err, user) => {
      if (err || !user) return res.status(404).json({ error: 'User not found' });
      res.json({ user });
    });
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
