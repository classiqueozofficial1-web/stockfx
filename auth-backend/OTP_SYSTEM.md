# OTP Email Verification System

## Overview
Production-grade OTP (One-Time Password) email verification system for user registration with security best practices.

## Features

✅ **Security**
- 6-digit OTP with bcrypt hashing
- 5-minute expiration time
- Rate limiting (60-second cooldown between requests)
- Maximum 5 failed verification attempts
- No sensitive information in responses

✅ **Email Integration**
- Nodemailer support for multiple providers (Gmail, Outlook, Yahoo, SendGrid, etc.)
- Fallback to console logging for development
- Beautiful HTML email templates
- Async email sending

✅ **API Endpoints**
- `POST /api/auth/register` - Register user and send OTP
- `POST /api/auth/verify-otp` - Verify OTP and mark user as verified
- `POST /api/auth/resend-otp` - Resend OTP with rate limiting
- `POST /api/auth/login` - Login only if email is verified
- `GET /api/auth/users` - Admin endpoint to list users
- `GET /api/health` - Health check

## Setup

### 1. Install Dependencies
```bash
npm install nodemailer
```

### 2. Configure Email Service

#### Option A: Gmail (Recommended for Development)
1. Enable 2-Step Verification: https://myaccount.google.com/security
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Copy to `.env`:
```
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

#### Option B: Other Email Services
Update `.env` with your provider:
```
EMAIL_SERVICE=outlook  # or yahoo, sendgrid, etc.
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
```

#### Option C: Development (Console Fallback)
Leave `EMAIL_USER` and `EMAIL_PASSWORD` empty. OTP will print to console.

### 3. Run the Server
```bash
npm run dev
# or
node src/server-enhanced.js
```

## API Usage Examples

### Register User
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "firstName": "John"
  }'
```

**Response:**
```json
{
  "message": "Registration successful. Check your email for OTP.",
  "email": "user@example.com",
  "expiresIn": 300
}
```

### Verify OTP
```bash
curl -X POST http://localhost:4000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "otp": "123456"
  }'
```

**Response on Success:**
```json
{
  "message": "Email verified successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1234567890",
    "email": "user@example.com",
    "firstName": "John",
    "balance": 0
  }
}
```

**Response on Invalid OTP:**
```json
{
  "message": "Invalid OTP",
  "attemptsRemaining": 4,
  "messageDetail": "Invalid OTP. 4 attempts remaining."
}
```

### Resend OTP
```bash
curl -X POST http://localhost:4000/api/auth/resend-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

**Response:**
```json
{
  "message": "OTP sent successfully",
  "email": "user@example.com",
  "expiresIn": 300
}
```

**Response if Rate Limited:**
```json
{
  "message": "Please wait 45s before requesting another OTP",
  "retryAfter": 45
}
```

### Login (Requires Verified Email)
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

## Error Responses

| Status | Message | Details |
|--------|---------|---------|
| 400 | Invalid OTP | OTP is not 6 digits |
| 400 | Email already registered | User already exists |
| 401 | Invalid OTP | OTP doesn't match hashed value |
| 401 | Invalid credentials | Wrong email or password |
| 403 | Email not verified | User must verify email first |
| 404 | User not found | Email not registered |
| 410 | OTP expired | Need to request new OTP |
| 429 | Too many attempts | Max 5 failed attempts reached |
| 429 | Rate limited | Must wait 60s before resending |

## Security Implementation

### OTP Hashing
```javascript
// OTP is hashed before storing
const otp = "123456";
const hashedOtp = await bcrypt.hash(otp, 10);
// Stored in database: $2a$10$... (bcrypt hash)
```

### Rate Limiting
- **Resend Cooldown**: 60 seconds between OTP requests
- **Failed Attempts**: Maximum 5 invalid OTP entries
- **Expiration**: 5 minutes from generation

### Attempt Tracking
```javascript
// After each failed attempt:
user.otpAttempts += 1;

// After 5 failed attempts:
if (user.otpAttempts >= 5) {
  // Reset OTP and require new registration request
  user.hashedOtp = null;
  user.otpExpiry = null;
  user.otpAttempts = 0;
}
```

### Password Security
```javascript
// Passwords hashed with bcrypt
const hashedPassword = await bcrypt.hash(password, 10);
// Stored: $2a$10$... (bcrypt hash)
```

## Database Schema (User Object)

```json
{
  "id": "1234567890",
  "email": "user@example.com",
  "password": "$2a$10$...",
  "firstName": "John",
  "balance": 0,
  "isVerified": true,
  "createdAt": "2026-02-16T10:30:00.000Z",
  "verifiedAt": "2026-02-16T10:35:00.000Z",
  "hashedOtp": null,
  "otpExpiry": null,
  "otpAttempts": 0,
  "lastOtpRequest": 1739699400000
}
```

## Environment Variables

```dotenv
# Required
PORT=4000
JWT_SECRET=your-super-secret-key

# Email Service (Optional for development)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Optional
MONGO_URI=mongodb://localhost:27017/authdb
```

## Testing Flow

1. **Register with email**
   ```
   POST /api/auth/register
   → OTP sent to email
   ```

2. **Check console for OTP** (if email not configured)
   ```
   🔐 OTP for user@example.com: 123456
   ```

3. **Verify OTP within 5 minutes**
   ```
   POST /api/auth/verify-otp
   → User marked as verified
   → JWT token returned
   ```

4. **Login with verified email**
   ```
   POST /api/auth/login
   → User can now access dashboard
   ```

## Troubleshooting

### Email not sending?
1. Check if `EMAIL_USER` and `EMAIL_PASSWORD` are set in `.env`
2. Check console for error messages
3. For Gmail: Ensure app password is used (not regular password)
4. OTP will still print to console as fallback

### "Too many attempts" error?
- User must wait before requesting new OTP
- Contact admin to reset `otpAttempts` counter

### "OTP expired" error?
- User must request new OTP
- Call `POST /api/auth/resend-otp`

### Rate limit error?
- User must wait 60 seconds before requesting new OTP
- Response includes `retryAfter` seconds

## Production Checklist

- [ ] Set strong `JWT_SECRET` in `.env`
- [ ] Verify email service credentials work
- [ ] Test OTP email delivery
- [ ] Set up email templates (customize HTML)
- [ ] Monitor failed verification attempts
- [ ] Set up logging and monitoring
- [ ] Use HTTPS in production
- [ ] Consider database migration from JSON to MongoDB
- [ ] Set up rate limiting on API endpoints
- [ ] Configure SMTP with TLS/SSL
- [ ] Add email bounce handling
- [ ] Set up automatic OTP cleanup (expired records)

## Future Enhancements

- [ ] SMS OTP as fallback
- [ ] Two-factor authentication (TOTP/HOTP)
- [ ] Device fingerprinting
- [ ] Brute force protection
- [ ] Email verification links (alternative to OTP)
- [ ] Magic link authentication
- [ ] OAuth2 provider integration
- [ ] Social login verification
