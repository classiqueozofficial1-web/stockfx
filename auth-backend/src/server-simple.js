require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const DB_FILE = path.join(__dirname, '../users.json');

// OTP utility functions
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function sendOTPEmail(email, otp) {
  console.log(`🔐 OTP for ${email}: ${otp}`);
  // In production, integrate with email service
  return true;
}

// Simple file-based storage
function loadUsers() {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Error loading users:', err.message);
  }
  return [];
}

function saveUsers(users) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving users:', err.message);
  }
}

// Register endpoint
app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const users = loadUsers();
    const existing = users.find(u => u.email === email);
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    const newUser = {
      id: Date.now().toString(),
      email,
      name: name || email,
      password: hashedPassword,
      balance: 0,
      createdAt: new Date().toISOString(),
      otp,
      otpExpiry: otpExpiry.toISOString(),
      isVerified: false
    };

    users.push(newUser);
    saveUsers(users);

    // Send OTP to email
    await sendOTPEmail(email, otp);

    res.status(201).json({
      message: 'User created. OTP sent to email',
      email,
      tempToken: email // Temporary identifier for OTP verification
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Login endpoint
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const users = loadUsers();
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        balance: user.balance
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Verify OTP endpoint
app.post('/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP required' });
    }

    const users = loadUsers();
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check OTP validity
    if (user.otp !== otp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }
    if (new Date() > new Date(user.otpExpiry)) {
      return res.status(401).json({ message: 'OTP expired' });
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    saveUsers(users);

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Email verified successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        balance: user.balance
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Resend OTP endpoint
app.post('/auth/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email required' });
    }

    const users = loadUsers();
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry.toISOString();
    saveUsers(users);

    // Send OTP to email
    await sendOTPEmail(email, otp);

    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// List users (admin)
app.get('/auth/users', (req, res) => {
  try {
    const users = loadUsers();
    res.json({
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        balance: u.balance,
        createdAt: u.createdAt
      }))
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Update balance (admin)
app.post('/auth/user/balance', (req, res) => {
  try {
    const { userId, amount } = req.body;
    const users = loadUsers();
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.balance = (user.balance || 0) + amount;
    saveUsers(users);
    res.json({ message: 'Balance updated', balance: user.balance });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Edit name (admin)
app.post('/auth/user/name', (req, res) => {
  try {
    const { userId, name } = req.body;
    const users = loadUsers();
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.name = name;
    saveUsers(users);
    res.json({ message: 'Name updated', name: user.name });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Send notification (admin)
app.post('/auth/user/notify', (req, res) => {
  try {
    const { userId, message } = req.body;
    const users = loadUsers();
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: `Notification sent to ${user.email}` });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Auth server running on http://localhost:${PORT}`);
});
