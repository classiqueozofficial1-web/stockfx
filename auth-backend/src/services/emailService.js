const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Store verification tokens in memory (in production, use database)
const verificationTokens = new Map();

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

// Verify email connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.warn('⚠️  Email service not configured.');
    console.warn('Set EMAIL_USER and EMAIL_PASSWORD in .env to enable email sending.');
  } else {
    console.log('✅ Email verification service ready');
  }
});

/**
 * Generate a verification token for email verification
 * @param {string} email - User email
 * @param {number} expiryMinutes - Token expiry time in minutes (default: 24 hours)
 * @returns {string} Verification token
 */
function generateVerificationToken(email, expiryMinutes = 1440) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiryTime = Date.now() + expiryMinutes * 60 * 1000;
  
  verificationTokens.set(token, {
    email,
    expiresAt: expiryTime,
  });

  // Auto-cleanup expired tokens
  setTimeout(() => {
    verificationTokens.delete(token);
  }, expiryMinutes * 60 * 1000);

  return token;
}

/**
 * Verify a verification token
 * @param {string} token - Verification token
 * @returns {object|null} Returns email if valid, null if expired or invalid
 */
function verifyToken(token) {
  const tokenData = verificationTokens.get(token);
  
  if (!tokenData) {
    return null;
  }

  if (Date.now() > tokenData.expiresAt) {
    verificationTokens.delete(token);
    return null;
  }

  verificationTokens.delete(token); // Token is single-use
  return tokenData.email;
}

/**
 * Send verification email with signup link
 * @param {string} email - Recipient email
 * @param {string} token - Verification token
 * @param {string} frontendUrl - Frontend URL for verification link
 */
async function sendVerificationEmail(email, token, frontendUrl = 'http://localhost:5173') {
  const verificationLink = `${frontendUrl}/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Verify Your StockFX Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">Welcome to StockFX</h1>
        </div>
        
        <div style="background: #f8fafc; padding: 40px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
          <p style="color: #475569; font-size: 16px; margin-top: 0;">
            Hi there,
          </p>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            Thank you for registering with StockFX! To complete your email verification, please click the button below:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 12px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 16px;">
              Verify Email Address
            </a>
          </div>
          
          <p style="color: #64748b; font-size: 14px; line-height: 1.6;">
            Or copy and paste this link in your browser:
          </p>
          
          <p style="background: white; padding: 12px; border-radius: 4px; border: 1px solid #e2e8f0; color: #0891b2; font-size: 12px; word-break: break-all;">
            ${verificationLink}
          </p>
          
          <p style="color: #64748b; font-size: 13px; margin-top: 25px; margin-bottom: 0;">
            This link will expire in 24 hours.
          </p>
          
          <p style="color: #64748b; font-size: 13px; margin-top: 10px;">
            If you didn't create this account, please ignore this email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;">
          
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
            © 2026 StockFX. All rights reserved.
          </p>
        </div>
      </div>
    `,
  };

  try {
    console.log(`📧 Attempting to send verification email to ${email}...`);
    await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('❌ Failed to send verification email:', error);
    console.error('Error code:', error.code);
    console.error('Error response:', error.response);
    console.error('Error details:', error.message);
    return false;
  }
}

module.exports = {
  generateVerificationToken,
  verifyToken,
  sendVerificationEmail,
};
