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

// Simple delay utility
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Translate text using MyMemory API (free, no auth required)
function translateText(text, targetLang) {
  return new Promise((resolve) => {
    if (!text || text.length === 0) {
      resolve(text);
      return;
    }

    const encodedText = encodeURIComponent(text.substring(0, 500));
    const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=en|${targetLang}`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.responseStatus === 200) {
            resolve(json.responseData.translatedText);
          } else {
            resolve(text);
          }
        } catch (e) {
          resolve(text);
        }
      });
    }).on('error', () => resolve(text));
  });
}

// Recursively translate with minimal delays
async function translateObject(obj, targetLang) {
  const translated = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      translated[key] = await translateText(value, targetLang);
    } else if (typeof value === 'object' && value !== null) {
      translated[key] = await translateObject(value, targetLang);
    } else {
      translated[key] = value;
    }
  }

  return translated;
}

async function main() {
  console.log('🌍 StockFx Multi-Language Translation\n');

  const enContent = JSON.parse(fs.readFileSync(enFile, 'utf-8'));
  const languages = Object.entries(LANGUAGE_MAP);
  let completed = 0;
  let skipped = 0;

  // Process sequentially with minimal delays
  for (const [langCode, targetLang] of languages) {
    const filePath = path.join(localesDir, `${langCode}.json`);

    if (fs.existsSync(filePath)) {
      const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      if (JSON.stringify(existing) !== JSON.stringify(enContent)) {
        console.log(`⏭️  ${langCode.padEnd(8)} - Already translated`);
        skipped++;
        continue;
      }
    }

    try {
      process.stdout.write(`🔄 ${langCode.padEnd(8)} - Translating...`);
      const translated = await translateObject(enContent, targetLang);
      fs.writeFileSync(filePath, JSON.stringify(translated, null, 2), 'utf-8');
      console.log(' ✅');
      completed++;
    } catch (error) {
      console.log(` ❌ ${error.message}`);
    }

    // Small delay between languages to avoid rate limiting
    await delay(200);
  }

  console.log(`\n📊 Summary:\n  ✅ Translated: ${completed}\n  ⏭️  Skipped: ${skipped}\n  📊 Total: ${languages.length}`);
}

main().catch(console.error);
