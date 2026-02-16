import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Fallback: if SMTP is not configured, use console logging (development)
const isDevelopment = !process.env.SMTP_USER || !process.env.SMTP_PASSWORD;

export class EmailService {
  /**
   * Send email verification code
   */
  static async sendVerificationEmail(
    email: string,
    verificationToken: string,
    userName?: string
  ): Promise<boolean> {
    try {
      const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/#verify-email?token=${verificationToken}`;
      
      const htmlContent = `
        <h2>Welcome to StockFx, ${userName || 'User'}!</h2>
        <p>Thank you for registering. Please verify your email address by clicking the link below:</p>
        <p>
          <a href="${verificationLink}" style="display: inline-block; padding: 10px 20px; background-color: #f59e0b; color: white; text-decoration: none; border-radius: 5px;">
            Verify Email
          </a>
        </p>
        <p>Or copy and paste this link in your browser:</p>
        <p>${verificationLink}</p>
        <p>This link will expire in 24 hours.</p>
        <p>If you didn't create an account, please ignore this email.</p>
      `;

      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@stockfx.com',
        to: email,
        subject: 'Verify Your Email - StockFx',
        html: htmlContent,
        text: `Verify your email at: ${verificationLink}\n\nThis link will expire in 24 hours.`,
      };

      if (isDevelopment) {
        console.log('📧 [DEV MODE] Email would be sent:');
        console.log(`   To: ${email}`);
        console.log(`   Subject: ${mailOptions.subject}`);
        console.log(`   Verification Link: ${verificationLink}`);
        return true;
      }

      await transporter.sendMail(mailOptions);
      console.log(`✓ Verification email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Failed to send verification email:', error);
      return false;
    }
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(
    email: string,
    resetToken: string,
    userName?: string
  ): Promise<boolean> {
    try {
      const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/#reset-password?token=${resetToken}`;
      
      const htmlContent = `
        <h2>Password Reset - StockFx</h2>
        <p>Hi ${userName || 'User'},</p>
        <p>We received a request to reset your password. Click the link below to reset it:</p>
        <p>
          <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #f59e0b; color: white; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
        </p>
        <p>Or copy and paste this link:</p>
        <p>${resetLink}</p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `;

      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@stockfx.com',
        to: email,
        subject: 'Reset Your Password - StockFx',
        html: htmlContent,
        text: `Reset your password at: ${resetLink}\n\nThis link will expire in 1 hour.`,
      };

      if (isDevelopment) {
        console.log('📧 [DEV MODE] Password reset email would be sent:');
        console.log(`   To: ${email}`);
        console.log(`   Reset Link: ${resetLink}`);
        return true;
      }

      await transporter.sendMail(mailOptions);
      console.log(`✓ Password reset email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      return false;
    }
  }

  /**
   * Send welcome email after verification
   */
  static async sendWelcomeEmail(
    email: string,
    userName?: string
  ): Promise<boolean> {
    try {
      const htmlContent = `
        <h2>Welcome to StockFx, ${userName || 'User'}!</h2>
        <p>Your email has been verified successfully.</p>
        <p>You can now access all features of StockFx:</p>
        <ul>
          <li>Trade stocks, crypto, and ETFs</li>
          <li>Build and manage your portfolio</li>
          <li>Access real-time market data</li>
          <li>Use advanced charting tools</li>
        </ul>
        <p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="display: inline-block; padding: 10px 20px; background-color: #f59e0b; color: white; text-decoration: none; border-radius: 5px;">
            Go to Dashboard
          </a>
        </p>
        <p>Happy trading!</p>
      `;

      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@stockfx.com',
        to: email,
        subject: 'Welcome to StockFx!',
        html: htmlContent,
        text: 'Welcome to StockFx! You can now access all features.',
      };

      if (isDevelopment) {
        console.log('📧 [DEV MODE] Welcome email would be sent to:', email);
        return true;
      }

      await transporter.sendMail(mailOptions);
      console.log(`✓ Welcome email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return false;
    }
  }

  /**
   * Send account termination notification
   */
  static async sendAccountTerminationEmail(
    email: string,
    userName?: string,
    reason?: string
  ): Promise<boolean> {
    try {
      const htmlContent = `
        <h2>Account Termination Notice</h2>
        <p>Hi ${userName || 'User'},</p>
        <p>Your StockFx account has been terminated.</p>
        ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
        <p>If you believe this is a mistake, please contact support at support@stockfx.com</p>
        <p>Your data has been archived and is retained according to our privacy policy.</p>
      `;

      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@stockfx.com',
        to: email,
        subject: 'Account Termination - StockFx',
        html: htmlContent,
        text: `Your account has been terminated. ${reason ? `Reason: ${reason}` : ''}`,
      };

      if (isDevelopment) {
        console.log('📧 [DEV MODE] Account termination email would be sent to:', email);
        return true;
      }

      await transporter.sendMail(mailOptions);
      console.log(`✓ Account termination email sent to ${email}`);
      return true;
    } catch (error) {
      console.error('Failed to send account termination email:', error);
      return false;
    }
  }
}

export default EmailService;
