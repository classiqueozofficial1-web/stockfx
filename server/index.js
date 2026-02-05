const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const { nanoid } = require('nanoid');
const path = require('path');

const DB_FILE = path.join(__dirname, 'db.json');
const adapter = new JSONFile(DB_FILE);
// Provide default data to avoid 'missing default data' errors when db.json is missing
const db = new Low(adapter, { users: [] });

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const PORT = process.env.PORT || 4000;

async function initDb() {
  await db.read();
  db.data = db.data || { users: [] };
  await db.write();
}

(async () => {
  try {
    await initDb();
  } catch (e) {
    console.error('Failed initializing DB:', e);
  }
})();

const app = express();
app.use(express.json());
app.use(cookieParser());

// CORS: in development, allow any origin (echo) to avoid 'failed to fetch' during local dev.
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({ origin: true, credentials: true }));
} else {
  // Replace with your production origin(s)
  app.use(cors({ origin: ['https://your-production-origin.com'], credentials: true }));
}

// Simple request logging to make debugging network issues easier
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

function createToken(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!email || !password || !name) return res.status(400).json({ error: 'Missing fields' });
  const normalized = email.toLowerCase().trim();
  await db.read();
  const existing = db.data.users.find(u => u.email === normalized);
  if (existing) return res.status(409).json({ error: 'A user with that email already exists' });
  const hash = await bcrypt.hash(password, 10);
  const user = { id: nanoid(), name, email: normalized, passwordHash: hash, createdAt: new Date().toISOString(), balance: 0, verified: true };
  db.data.users.push(user);
  await db.write();
  const token = createToken(user);
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
  // Return consistent response shape
  res.json({ user: { id: user.id, name: user.name, email: user.email } });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  const normalized = email.toLowerCase().trim();
  await db.read();
  const user = db.data.users.find(u => u.email === normalized);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash || '');
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = createToken(user);
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
  res.json({ user: { id: user.id, name: user.name, email: user.email } });
});

app.get('/api/me', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Not authenticated' });
    const data = jwt.verify(token, JWT_SECRET);
    await db.read();
    const user = db.data.users.find(u => u.id === data.id);
    if (!user) return res.status(401).json({ error: 'Not authenticated' });
    const { passwordHash, ...publicUser } = user;
    res.json({ user: publicUser });
  } catch (e) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
});

// Dev-only: list users (no password hashes) to help debug registration/storage
if (process.env.NODE_ENV !== 'production') {
  app.get('/api/debug/users', async (req, res) => {
    await db.read();
    const users = (db.data.users || []).map(u => ({ id: u.id, name: u.name, email: u.email, createdAt: u.createdAt }));
    res.json({ users });
  });
}

app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
});

const HOST = process.env.HOST || '127.0.0.1';
const server = app.listen(PORT, HOST, () => console.log('Auth server listening on', HOST + ':' + PORT));
server.on('error', (err) => {
  console.error('Server listen error:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});
server.on('error', (err) => {
  console.error('Server listen error:', err);
  process.exit(1);
});
