#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const localesDir = path.join(__dirname, '../src/i18n/locales');

const newRegisterSection = {
  "register": {
    "title": "Create your account",
    "subtitle": "Already have an account?",
    "haveAccount": "Sign in",
    "firstNameLabel": "First Name",
    "firstNamePlaceholder": "John",
    "lastNameLabel": "Last Name",
    "lastNamePlaceholder": "Doe",
    "emailLabel": "Email address",
    "emailPlaceholder": "you@example.com",
    "passwordLabel": "Password",
    "passwordPlaceholder": "Create a password",
    "passwordHelper": "Must be at least 8 characters",
    "termsLabel": "I agree to the",
    "terms": "Terms",
    "and": "and",
    "privacy": "Privacy Policy",
    "createButton": "Create Account",
    "checkEmail": "Check your email",
    "resendLink": "Resend verification link",
    "changeEmail": "Use different email",
    "useDifferentEmail": "Use different email"
  }
};

// Get all JSON files in locales directory
const files = fs.readdirSync(localesDir).filter(f => f.endsWith('.json'));

console.log(`Found ${files.length} locale files. Updating register section...`);

let updated = 0;
let errors = 0;

files.forEach(file => {
  try {
    const filePath = path.join(localesDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    // Update the register section
    data.register = newRegisterSection.register;
    
    // Write back to file with proper formatting
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
    
    updated++;
    console.log(`✓ ${file}`);
  } catch (err) {
    errors++;
    console.error(`✗ ${file}: ${err.message}`);
  }
});

console.log(`\nComplete! Updated: ${updated}, Errors: ${errors}`);
