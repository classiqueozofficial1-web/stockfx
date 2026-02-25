const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Store verification codes in memory (in production, use database)
const verificationCodes = new Map();

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
 * Generate a 6-digit verification code
 * @param {string} email - User email
 * @param {number} expiryMinutes - Code expiry time in minutes (default: 15 minutes)
 * @returns {string} 6-digit verification code
 */
function generateVerificationCode(email, expiryMinutes = 15) {
  // Generate a 6-digit code
  const code = Math.floor(Math.random() * 900000) + 100000;
  const codeString = code.toString();
  const expiryTime = Date.now() + expiryMinutes * 60 * 1000;
  
  verificationCodes.set(codeString, {
    email,
    expiresAt: expiryTime,
    attempts: 0,
    maxAttempts: 5,
  });

  // Auto-cleanup expired codes
  setTimeout(() => {
    verificationCodes.delete(codeString);
  }, expiryMinutes * 60 * 1000);

  return codeString;
}

/**
 * Verify a verification code
 * @param {string} code - 6-digit verification code
 * @param {string} email - User email to verify against
 * @returns {object|null} Returns {email, success: true} if valid, null if expired or invalid
 */
function verifyCode(code, email) {
  const codeData = verificationCodes.get(code);
  
  if (!codeData) {
    return null;
  }

  // Check if code matches email
  if (codeData.email.toLowerCase() !== email.toLowerCase()) {
    codeData.attempts++;
    if (codeData.attempts >= codeData.maxAttempts) {
      verificationCodes.delete(code);
    }
    return null;
  }

  // Check if expired
  if (Date.now() > codeData.expiresAt) {
    verificationCodes.delete(code);
    return null;
  }

  verificationCodes.delete(code); // Code is single-use
  return { email: codeData.email, success: true };
}

/**
 * Generate a verification token (deprecated - kept for backward compatibility)
 */
function generateVerificationToken(email, expiryMinutes = 1440) {
  return generateVerificationCode(email, expiryMinutes);
}

/**
 * Verify a token (deprecated - kept for backward compatibility)
 */
function verifyToken(token) {
  const tokenData = verificationCodes.get(token);
  
  if (!tokenData) {
    return null;
  }

  if (Date.now() > tokenData.expiresAt) {
    verificationCodes.delete(token);
    return null;
  }

  verificationCodes.delete(token);
  return tokenData.email;
}

/**
 * Send verification email with code
 * @param {string} email - Recipient email
 * @param {string} code - 6-digit verification code
 * @param {string} frontendUrl - Frontend URL (optional)
 */
async function sendVerificationEmail(email, code, frontendUrl = 'http://localhost:5173') {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'StockFX Email Verification Code - Do Not Share',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">StockFX</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0;">Email Verification</p>
        </div>
        
        <div style="background: #f8fafc; padding: 40px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
          <p style="color: #475569; font-size: 16px; margin-top: 0;">
            Hi there,
          </p>
          
          <p style="color: #475569; font-size: 16px; line-height: 1.6; margin: 20px 0;">
            Welcome to StockFX! To verify your email address and complete your registration, use the verification code below:
          </p>
          
          <div style="background: white; border: 2px solid #10b981; border-radius: 8px; padding: 30px; text-align: center; margin: 35px 0;">
            <p style="color: #64748b; font-size: 14px; margin: 0 0 15px 0; text-transform: uppercase; letter-spacing: 2px;">Your Verification Code</p>
            <div style="font-size: 48px; font-weight: bold; color: #10b981; letter-spacing: 8px; font-family: 'Courier New', monospace; margin: 0;">
              ${code}
            </div>
            <p style="color: #94a3b8; font-size: 12px; margin: 15px 0 0 0;">This code will expire in 15 minutes</p>
          </div>
          
          <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin: 25px 0;">
            <p style="color: #92400e; font-size: 14px; margin: 0; font-weight: bold;">⚠️ Security Notice</p>
            <p style="color: #b45309; font-size: 13px; margin: 8px 0 0 0;">
              Never share this code with anyone. StockFX staff will never ask for your verification code.
            </p>
          </div>
          
          <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 25px 0 15px 0;">
            <strong>Steps to verify:</strong>
          </p>
          <ol style="color: #64748b; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li>Copy the 6-digit code above</li>
            <li>Go back to the StockFX verification page</li>
            <li>Paste the code and submit</li>
          </ol>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="color: #64748b; font-size: 13px; margin: 0 0 10px 0;">
            If you didn't create this account, please ignore this email.
          </p>
          
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 20px 0 0 0;">
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
  generateVerificationCode,
  generateVerificationToken, // Backward compatibility
  verifyCode,
  verifyToken, // Backward compatibility
  sendVerificationEmail,
};
