require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const DB_FILE = path.join(__dirname, '../users.json');
const OTP_EXPIRY_MINUTES = 5;
const MAX_OTP_ATTEMPTS = 5;
const OTP_RESEND_COOLDOWN_SECONDS = 60;

// ==================== EMAIL SERVICE ====================
console.log('DEBUG: EMAIL_SERVICE =', process.env.EMAIL_SERVICE);
console.log('DEBUG: EMAIL_USER =', process.env.EMAIL_USER);
console.log('DEBUG: EMAIL_PASSWORD =', process.env.EMAIL_PASSWORD ? '***set***' : 'undefined');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // Disable SSL cert validation for development
  },
});

// Test email connection on startup
if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
  transporter.verify((error, success) => {
    if (error) {
      console.warn('⚠️  Email service not configured. OTP will print to console.');
      console.warn('Set EMAIL_USER and EMAIL_PASSWORD in .env to enable email sending.');
      console.error('Error details:', error.message);
    } else {
      console.log('✅ Email service ready');
    }
  });
} else {
  console.log('📧 Email service: Disabled (no credentials in .env)');
}

/**
 * Send OTP email to user
 */
async function sendOtpEmail(email, otp) {
  try {
    // If email configured, try to send
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      try {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'StockFX - Your OTP Verification Code',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2>Email Verification</h2>
              <p>Your OTP verification code is:</p>
              <div style="font-size: 32px; font-weight: bold; color: #10b981; letter-spacing: 5px; margin: 20px 0;">
                ${otp}
              </div>
              <p>This code will expire in 5 minutes.</p>
              <p>If you didn't request this code, please ignore this email.</p>
            </div>
          `,
        };
        
        await transporter.sendMail(mailOptions);
        console.log(`📧 OTP email sent to ${email}`);
        return true;
      } catch (error) {
        console.warn(`⚠️  Failed to send email: ${error.message}`);
        // Fall back to console
        console.log(`\n🔐 OTP for ${email}: ${otp}\n`);
        return true;
      }
    } else {
      // If email not configured, log for development
      console.log(`\n🔐 OTP for ${email}: ${otp}\n`);
      return true;
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    return false;
  }
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Generate a random 6-digit OTP
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Hash OTP using bcrypt
 */
async function hashOTP(otp) {
  return await bcrypt.hash(otp, 10);
}

/**
 * Compare plain OTP with hashed OTP
 */
async function compareOTP(plainOTP, hashedOTP) {
  return await bcrypt.compare(plainOTP, hashedOTP);
}

/**
 * File-based user storage
 */
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

// ==================== MIDDLEWARE ====================

/**
 * Rate limiting middleware for OTP requests (60-second cooldown)
 */
async function rateLimitOTP(req, res, next) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email required' });
  }

  const users = loadUsers();
  const user = users.find(u => u.email === email);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Check rate limit
  if (user.lastOtpRequest) {
    const timeSinceLastRequest = (Date.now() - user.lastOtpRequest) / 1000;
    if (timeSinceLastRequest < OTP_RESEND_COOLDOWN_SECONDS) {
      const secondsRemaining = Math.ceil(OTP_RESEND_COOLDOWN_SECONDS - timeSinceLastRequest);
      return res.status(429).json({ 
        message: `Please wait ${secondsRemaining}s before requesting another OTP`,
        retryAfter: secondsRemaining
      });
    }
  }

  // Rate limit check passed, store user in request for next middleware
  req.user = user;
  req.users = users;
  next();
}

// ==================== API ENDPOINTS ====================

/**
 * POST /api/auth/register
 * Register a new user and send OTP
 */
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
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
    const hashedOtp = await hashOTP(otp);
    const otpExpiry = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;

    // Create user
    const newUser = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      firstName: firstName || email.split('@')[0],
      balance: 0,
      createdAt: new Date().toISOString(),
      isVerified: false,
      // OTP fields
      hashedOtp,
      otpExpiry,
      otpAttempts: 0,
      lastOtpRequest: Date.now(),
    };

    users.push(newUser);
    saveUsers(users);

    // Send OTP email
    await sendOtpEmail(email, otp);

    res.status(201).json({
      message: 'Registration successful. Check your email for OTP.',
      email,
      expiresIn: OTP_EXPIRY_MINUTES * 60, // seconds
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * POST /api/auth/login
 * Login with email and password
 */
app.post('/api/auth/login', async (req, res) => {
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

    // Check if verified
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Email not verified. Please verify your email first.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        balance: user.balance,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * POST /api/auth/verify-otp
 * Verify OTP and mark user as verified
 */
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validation
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP required' });
    }

    if (otp.length !== 6 || isNaN(otp)) {
      return res.status(400).json({ message: 'Invalid OTP format' });
    }

    const users = loadUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Already verified
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Check if OTP exists
    if (!user.hashedOtp) {
      return res.status(400).json({ message: 'No OTP request found. Please register again.' });
    }

    // Check OTP expiration
    if (Date.now() > user.otpExpiry) {
      user.hashedOtp = null;
      user.otpExpiry = null;
      user.otpAttempts = 0;
      saveUsers(users);
      return res.status(410).json({ 
        message: 'OTP expired',
        details: 'Please request a new OTP'
      });
    }

    // Check attempts
    if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
      user.hashedOtp = null;
      user.otpExpiry = null;
      user.otpAttempts = 0;
      saveUsers(users);
      return res.status(429).json({ 
        message: 'Too many attempts',
        details: 'Please request a new OTP'
      });
    }

    // Compare OTP
    const isOtpValid = await compareOTP(otp, user.hashedOtp);

    if (!isOtpValid) {
      user.otpAttempts += 1;
      saveUsers(users);
      
      const attemptsRemaining = MAX_OTP_ATTEMPTS - user.otpAttempts;
      return res.status(401).json({ 
        message: 'Invalid OTP',
        attemptsRemaining,
        messageDetail: `Invalid OTP. ${attemptsRemaining} attempts remaining.`
      });
    }

    // OTP is valid - mark user as verified
    user.isVerified = true;
    user.hashedOtp = null;
    user.otpExpiry = null;
    user.otpAttempts = 0;
    user.verifiedAt = new Date().toISOString();
    saveUsers(users);

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Email verified successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        balance: user.balance,
      },
    });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * POST /api/auth/resend-otp
 * Resend OTP with rate limiting
 */
app.post('/api/auth/resend-otp', rateLimitOTP, async (req, res) => {
  try {
    const user = req.user;
    const users = req.users;

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Generate new OTP
    const otp = generateOTP();
    const hashedOtp = await hashOTP(otp);
    const otpExpiry = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;

    // Update user
    user.hashedOtp = hashedOtp;
    user.otpExpiry = otpExpiry;
    user.otpAttempts = 0;
    user.lastOtpRequest = Date.now();
    saveUsers(users);

    // Send OTP email
    await sendOtpEmail(user.email, otp);

    res.json({
      message: 'OTP sent successfully',
      email: user.email,
      expiresIn: OTP_EXPIRY_MINUTES * 60,
    });
  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ==================== ADMIN ENDPOINTS ====================

app.get('/api/auth/users', (req, res) => {
  try {
    const users = loadUsers();
    res.json({
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        balance: u.balance,
        isVerified: u.isVerified,
        createdAt: u.createdAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.post('/api/auth/user/balance', (req, res) => {
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

app.post('/api/auth/user/name', (req, res) => {
  try {
    const { userId, firstName } = req.body;
    const users = loadUsers();
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.firstName = firstName;
    saveUsers(users);
    res.json({ message: 'Name updated', firstName: user.firstName });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Dashboard endpoint - returns user data for authenticated users
app.get('/api/dashboard', (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const users = loadUsers();
    const user = users.find(u => u.id === decoded.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Remove sensitive data before returning
    const { password, otpHash, otpExpires, otpAttempts, otpResendCooldown, ...safeUser } = user;
    res.json({ user: safeUser });
  } catch (err) {
    console.error('Dashboard error:', err.message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ Auth server running on http://localhost:${PORT}`);
  console.log(`📧 Email service: ${process.env.EMAIL_USER ? 'Enabled' : 'Disabled (console fallback)'}\n`);
});
