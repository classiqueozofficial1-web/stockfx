require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const emailService = require('./services/emailService');
const User = require('./models/user');
const connectMongoDB = require('./config/mongodb');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
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
    rejectUnauthorized: false,
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
        console.log(`\n🔐 OTP for ${email}: ${otp}\n`);
        return true;
      }
    } else {
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

// ==================== MIDDLEWARE ====================

/**
 * Rate limiting middleware for OTP requests (60-second cooldown)
 */
async function rateLimitOTP(req, res, next) {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email required' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check rate limit
    if (user.otpLastSentAt) {
      const timeSinceLastRequest = (Date.now() - user.otpLastSentAt) / 1000;
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
    next();
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// ==================== API ENDPOINTS ====================

/**
 * POST /api/auth/register
 * Register a new user and send OTP
 */
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

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

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Generate OTP
    const otp = generateOTP();
    const hashedOtp = await hashOTP(otp);
    const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Create user
    const newUser = new User({
      email: normalizedEmail,
      password,
      firstName: firstName || normalizedEmail.split('@')[0],
      lastName: lastName || '',
      balance: 50000,
      isVerified: false,
      status: 'active',
      totalProfit: 0,
      monthlyIncome: 0,
      activeTrades: 0,
      portfolioPerformance: 0,
      otp: hashedOtp,
      otpExpiry: otpExpiry,
      otpAttempts: 0,
      otpLastSentAt: new Date(),
    });

    await newUser.save();

    // Send OTP email
    await sendOtpEmail(normalizedEmail, otp);

    res.status(201).json({
      message: 'Registration successful. Check your email for OTP.',
      email: normalizedEmail,
      expiresIn: OTP_EXPIRY_MINUTES * 60,
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

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if verified
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Email not verified. Please verify your email first.' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName || '',
        balance: user.balance,
        isVerified: true,
        totalProfit: user.totalProfit || 0,
        monthlyIncome: user.monthlyIncome || 0,
        activeTrades: user.activeTrades || 0,
        portfolioPerformance: user.portfolioPerformance || 0,
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

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Already verified
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Check if OTP exists
    if (!user.otp) {
      return res.status(400).json({ message: 'No OTP request found. Please register again.' });
    }

    // Check OTP expiration
    if (Date.now() > user.otpExpiry) {
      user.otp = null;
      user.otpExpiry = null;
      user.otpAttempts = 0;
      await user.save();
      return res.status(410).json({ 
        message: 'OTP expired',
        details: 'Please request a new OTP'
      });
    }

    // Check attempts
    if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
      user.otp = null;
      user.otpExpiry = null;
      user.otpAttempts = 0;
      await user.save();
      return res.status(429).json({ 
        message: 'Too many attempts',
        details: 'Please request a new OTP'
      });
    }

    // Compare OTP
    const isOtpValid = await compareOTP(otp, user.otp);

    if (!isOtpValid) {
      user.otpAttempts += 1;
      await user.save();
      
      const attemptsRemaining = MAX_OTP_ATTEMPTS - user.otpAttempts;
      return res.status(401).json({ 
        message: 'Invalid OTP',
        attemptsRemaining,
        messageDetail: `Invalid OTP. ${attemptsRemaining} attempts remaining.`
      });
    }

    // OTP is valid - mark user as verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    user.otpAttempts = 0;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Email verified successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName || '',
        balance: user.balance,
        isVerified: true,
        totalProfit: user.totalProfit || 0,
        monthlyIncome: user.monthlyIncome || 0,
        activeTrades: user.activeTrades || 0,
        portfolioPerformance: user.portfolioPerformance || 0,
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

    // Check if already verified
    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Generate new OTP
    const otp = generateOTP();
    const hashedOtp = await hashOTP(otp);
    const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Update user
    user.otp = hashedOtp;
    user.otpExpiry = otpExpiry;
    user.otpAttempts = 0;
    user.otpLastSentAt = new Date();
    await user.save();

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

/**
 * GET /api/auth/users
 * Get all users
 */
app.get('/api/auth/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password -otp -otpExpiry -otpAttempts -verificationToken');
    res.json({
      users: users.map(u => ({
        id: u._id,
        email: u.email,
        name: u.name || `${u.firstName} ${u.lastName}`.trim(),
        firstName: u.firstName,
        lastName: u.lastName,
        balance: u.balance,
        isVerified: u.isVerified,
        createdAt: u.createdAt,
        totalProfit: u.totalProfit || 0,
        monthlyIncome: u.monthlyIncome || 0,
        activeTrades: u.activeTrades || 0,
        portfolioPerformance: u.portfolioPerformance || 0,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * POST /api/auth/user/balance
 * Update user balance
 */
app.post('/api/auth/user/balance', async (req, res) => {
  try {
    const { userId, amount } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.balance = (user.balance || 0) + amount;
    await user.save();
    res.json({ message: 'Balance updated', balance: user.balance });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * POST /api/auth/user/name
 * Update user name
 */
app.post('/api/auth/user/name', async (req, res) => {
  try {
    const { userId, firstName } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.firstName = firstName;
    await user.save();
    res.json({ message: 'Name updated', firstName: user.firstName });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * POST /api/auth/user/dashboard-stats
 * Update dashboard stats (admin only)
 */
app.post('/api/auth/user/dashboard-stats', async (req, res) => {
  try {
    const { userId, totalProfit, monthlyIncome, activeTrades, portfolioPerformance } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Update dashboard stats
    if (totalProfit !== undefined) user.totalProfit = totalProfit;
    if (monthlyIncome !== undefined) user.monthlyIncome = monthlyIncome;
    if (activeTrades !== undefined) user.activeTrades = activeTrades;
    if (portfolioPerformance !== undefined) user.portfolioPerformance = portfolioPerformance;
    await user.save();
    res.json({ 
      message: 'Dashboard stats updated',
      user: {
        id: user._id,
        email: user.email,
        totalProfit: user.totalProfit,
        monthlyIncome: user.monthlyIncome,
        activeTrades: user.activeTrades,
        portfolioPerformance: user.portfolioPerformance,
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

/**
 * GET /api/dashboard
 * Dashboard endpoint for authenticated users
 */
app.get('/api/dashboard', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = await User.findById(decoded.id).select('-password -otp -otpExpiry -otpAttempts');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user: user.toJSON() });
  } catch (err) {
    console.error('Dashboard error:', err.message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

/**
 * GET /api/me
 * Get current user info
 */
app.get('/api/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const user = await User.findById(decoded.id).select('-password -otp -otpExpiry -otpAttempts');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ 
      user: user.toJSON(),
      success: true
    });
  } catch (err) {
    console.error('Get user error:', err.message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

/**
 * POST /api/auth/terminate-all-sessions
 * Delete all user records (development only)
 */
app.post('/api/auth/terminate-all-sessions', async (req, res) => {
  try {
    const result = await User.deleteMany({});
    const now = new Date().toISOString();
    res.json({ 
      success: true, 
      message: `All ${result.deletedCount} user records have been deleted and sessions terminated`,
      deletedCount: result.deletedCount,
      terminatedAt: now
    });
  } catch (err) {
    console.error('Terminate all sessions error:', err.message);
    res.status(500).json({ error: 'Failed to terminate sessions', details: err.message });
  }
});

// ==================== EMAIL VERIFICATION ENDPOINTS ====================

/**
 * POST /api/auth/register-with-link
 * Register with email verification link
 */
app.post('/api/auth/register-with-link', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;

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

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    // Create user (unverified)
    const newUser = new User({
      email: normalizedEmail,
      password,
      firstName: firstName || normalizedEmail.split('@')[0],
      lastName: lastName || '',
      balance: 50000,
      isVerified: false,
      status: 'active',
      totalProfit: 0,
      monthlyIncome: 0,
      activeTrades: 0,
      portfolioPerformance: 0,
    });

    await newUser.save();

    // Generate verification token and send email
    const verificationToken = emailService.generateVerificationToken(normalizedEmail);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    const emailSent = await emailService.sendVerificationEmail(normalizedEmail, verificationToken, frontendUrl);

    console.log(`Registration: Email sending ${emailSent ? 'succeeded' : 'failed - proceeding anyway for development'}`);

    res.status(201).json({
      message: emailSent 
        ? 'Registration successful. Verification email sent.' 
        : 'Registration successful. Email verification is available at /verify-email endpoint.',
      email: normalizedEmail,
      userId: newUser._id,
      verificationToken: emailSent ? undefined : verificationToken,
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

/**
 * GET /api/auth/verify-email
 * Verify email token endpoint
 */
app.get('/api/auth/verify-email', async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: 'Verification token required' });
    }

    // Verify token
    const email = emailService.verifyToken(token);

    if (!email) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    // Find and update user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isVerified = true;
    await user.save();

    // Generate JWT token for auto-login
    const jwtToken = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Email verified successfully',
      token: jwtToken,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        balance: user.balance || 0,
        isVerified: true,
        totalProfit: user.totalProfit || 0,
        monthlyIncome: user.monthlyIncome || 0,
        activeTrades: user.activeTrades || 0,
        portfolioPerformance: user.portfolioPerformance || 0,
      },
    });
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({ message: 'Verification failed', error: err.message });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString() 
  });
});

// ==================== START SERVER ====================

// Connect to MongoDB and start server
connectMongoDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n✅ Auth server running on http://localhost:${PORT}`);
    console.log(`📧 Email service: ${process.env.EMAIL_USER ? 'Enabled' : 'Disabled (console fallback)'}`);
    console.log(`🗄️  Database: MongoDB`);
    console.log(`📍 Connection: ${process.env.MONGO_URI}\n`);
  });
}).catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
