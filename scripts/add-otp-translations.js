import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '../src/i18n/locales');
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

// OTP translations to add to each language
const otpTranslations = {
  "verifyEmail": "Verify Your Email",
  "enterCode": "Enter the 6-digit code sent to your email",
  "otpPlaceholder": "000000",
  "verifyButton": "Verify Code",
  "otpExpired": "OTP has expired. Please request a new code.",
  "invalidOtp": "Invalid OTP. Please try again.",
  "resendCode": "Resend Code",
  "resendInProgress": "Resending...",
  "resendSuccess": "Code sent successfully",
  "resendError": "Failed to resend code",
  "useDifferentEmail": "Use different email",
  "otpSent": "Code sent to {{email}}",
  "resendIn": "Resend in {{seconds}}s"
};

console.log(`📝 Adding OTP translations to ${files.length} language files...`);

files.forEach(file => {
  const filePath = path.join(localesDir, file);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Ensure register section exists
  if (!content.register) {
    content.register = {};
  }
  
  // Add OTP translations
  Object.assign(content.register, otpTranslations);
  
  // Write back
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8');
  console.log(`✓ ${file}`);
});

console.log(`\n✅ Successfully updated all ${files.length} language files with OTP translations!`);
