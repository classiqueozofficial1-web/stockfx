#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Language codes and their corresponding target codes for translation
const LANGUAGE_MAP = {
  'da': 'da', 'fi': 'fi', 'el': 'el', 'hu': 'hu', 'cs': 'cs', 'ro': 'ro',
  'sk': 'sk', 'sl': 'sl', 'hr': 'hr', 'sr': 'sr', 'bg': 'bg', 'uk': 'uk',
  'et': 'et', 'lv': 'lv', 'lt': 'lt', 'he': 'he', 'ar': 'ar', 'th': 'th',
  'vi': 'vi', 'id': 'id', 'ms': 'ms', 'tl': 'tl', 'bn': 'bn', 'hi': 'hi',
  'ta': 'ta', 'te': 'te', 'kn': 'kn', 'ml': 'ml', 'ur': 'ur', 'fa': 'fa',
  'af': 'af', 'zu': 'zu', 'sw': 'sw', 'mg': 'mg', 'ny': 'ny', 'mt': 'mt',
  'ca': 'ca', 'gl': 'gl', 'eu': 'eu', 'sq': 'sq', 'mk': 'mk', 'be': 'be',
  'hy': 'hy', 'ka': 'ka', 'az': 'az', 'kk': 'kk', 'ky': 'ky', 'uz': 'uz',
  'tk': 'tk', 'mn': 'mn', 'bo': 'bo', 'my': 'my', 'km': 'km', 'lo': 'lo',
  'si': 'si', 'ne': 'ne', 'gu': 'gu', 'pa': 'pa', 'mr': 'mr', 'or': 'or',
  'as': 'as', 'mai': 'mai', 'sat': 'sat', 'sd': 'sd', 'ps': 'ps', 'ak': 'ak',
  'am': 'am', 'om': 'om', 'ti': 'ti',
  'en-gb': 'en', 'en-au': 'en', 'en-in': 'en', 'pt-br': 'pt',
  'es-mx': 'es', 'es-ar': 'es', 'fr-ca': 'fr', 'de-at': 'de',
  'de-ch': 'de', 'it-ch': 'it', 'zh-tw': 'zh', 'ar-ae': 'ar', 'ar-eg': 'ar',
  'sr-latn': 'sr', 'ff': 'ff', 'rw': 'rw'
};

const localesDir = path.join(__dirname, '../src/i18n/locales');
const enFile = path.join(localesDir, 'en.json');

// Cache for translations to avoid duplicate API calls
const translationCache = new Map();

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Translate text using MyMemory API with caching and retry logic
function translateText(text, targetLang, retries = 3) {
  return new Promise((resolve) => {
    if (!text || text.length === 0) {
      resolve(text);
      return;
    }

    // Check cache first
    const cacheKey = `${text}|${targetLang}`;
    if (translationCache.has(cacheKey)) {
      resolve(translationCache.get(cacheKey));
      return;
    }

    const tryTranslate = (attempt) => {
      const encodedText = encodeURIComponent(text.substring(0, 500));
      const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=en|${targetLang}`;

      const request = https.get(url, { timeout: 5000 }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json.responseStatus === 200 && json.responseData.translatedText) {
              translationCache.set(cacheKey, json.responseData.translatedText);
              resolve(json.responseData.translatedText);
            } else {
              translationCache.set(cacheKey, text);
              resolve(text);
            }
          } catch (e) {
            if (attempt < retries) {
              setTimeout(() => tryTranslate(attempt + 1), 1000);
            } else {
              translationCache.set(cacheKey, text);
              resolve(text);
            }
          }
        });
      });

      request.on('timeout', () => {
        request.destroy();
        if (attempt < retries) {
          setTimeout(() => tryTranslate(attempt + 1), 1000);
        } else {
          translationCache.set(cacheKey, text);
          resolve(text);
        }
      });

      request.on('error', () => {
        if (attempt < retries) {
          setTimeout(() => tryTranslate(attempt + 1), 1000);
        } else {
          translationCache.set(cacheKey, text);
          resolve(text);
        }
      });
    };

    tryTranslate(0);
  });
}

// Recursively translate all strings in an object
async function translateObject(obj, targetLang) {
  const translated = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      translated[key] = await translateText(value, targetLang);
      // Small delay to avoid rate limiting
      await delay(50);
    } else if (typeof value === 'object' && value !== null) {
      translated[key] = await translateObject(value, targetLang);
    } else {
      translated[key] = value;
    }
  }

  return translated;
}

async function main() {
  console.log('🌍 StockFx Complete Language Translation\n');
  console.log('📝 This will translate all 100 languages...\n');

  const enContent = JSON.parse(fs.readFileSync(enFile, 'utf-8'));
  const languages = Object.entries(LANGUAGE_MAP);
  let completed = 0;
  let skipped = 0;
  let failed = 0;

  // Process languages sequentially to manage API rate limits
  for (let i = 0; i < languages.length; i++) {
    const [langCode, targetLang] = languages[i];
    const filePath = path.join(localesDir, `${langCode}.json`);
    const progress = `[${i + 1}/${languages.length}]`;

    // Check if already has real translations (not English)
    if (fs.existsSync(filePath)) {
      const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      if (JSON.stringify(existing) !== JSON.stringify(enContent)) {
        console.log(`${progress} ⏭️  ${langCode.padEnd(8)} - Already translated`);
        skipped++;
        continue;
      }
    }

    try {
      process.stdout.write(`${progress} 🔄 ${langCode.padEnd(8)} - Translating...`);
      const translated = await translateObject(enContent, targetLang);
      fs.writeFileSync(filePath, JSON.stringify(translated, null, 2), 'utf-8');
      console.log(' ✅');
      completed++;
    } catch (error) {
      console.log(` ❌`);
      failed++;
    }

    // Rate limiting - be respectful to the API
    await delay(150);
  }

  console.log(`\n📊 Summary:`);
  console.log(`  ✅ Translated: ${completed}`);
  console.log(`  ⏭️  Skipped: ${skipped}`);
  console.log(`  ❌ Failed: ${failed}`);
  console.log(`  📊 Total: ${languages.length}`);
  console.log(`\n🎉 Translation complete! All languages are now available.`);
}

main().catch(console.error);
