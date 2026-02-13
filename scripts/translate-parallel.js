#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
const translationCache = new Map();
const MAX_CONCURRENT = 5; // Parallel requests

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function translateText(text, targetLang) {
  return new Promise((resolve) => {
    if (!text || text.length === 0) {
      resolve(text);
      return;
    }

    const cacheKey = `${text}|${targetLang}`;
    if (translationCache.has(cacheKey)) {
      resolve(translationCache.get(cacheKey));
      return;
    }

    const encodedText = encodeURIComponent(text.substring(0, 500));
    const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=en|${targetLang}`;

    const request = https.get(url, { timeout: 8000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const result = json.responseStatus === 200 && json.responseData.translatedText 
            ? json.responseData.translatedText 
            : text;
          translationCache.set(cacheKey, result);
          resolve(result);
        } catch (e) {
          translationCache.set(cacheKey, text);
          resolve(text);
        }
      });
    }).on('timeout', () => {
      request.destroy();
      translationCache.set(cacheKey, text);
      resolve(text);
    }).on('error', () => {
      translationCache.set(cacheKey, text);
      resolve(text);
    });
  });
}

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

async function processLanguagesInParallel(languages, batch) {
  const results = [];
  for (const [langCode, targetLang] of batch) {
    results.push(
      (async () => {
        const filePath = path.join(localesDir, `${langCode}.json`);
        const enContent = JSON.parse(fs.readFileSync(enFile, 'utf-8'));

        if (fs.existsSync(filePath)) {
          const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          if (JSON.stringify(existing) !== JSON.stringify(enContent)) {
            return { code: langCode, status: 'skipped' };
          }
        }

        try {
          const translated = await translateObject(enContent, targetLang);
          fs.writeFileSync(filePath, JSON.stringify(translated, null, 2), 'utf-8');
          return { code: langCode, status: 'success' };
        } catch (error) {
          return { code: langCode, status: 'failed', error: error.message };
        }
      })()
    );
  }

  return Promise.all(results);
}

async function main() {
  console.log('🌍 StockFx Complete Language Translation (Parallel)\n');

  const languages = Object.entries(LANGUAGE_MAP);
  const needsTranslation = [];

  // Filter languages that need translation
  const enContent = JSON.parse(fs.readFileSync(enFile, 'utf-8'));
  for (const [langCode, targetLang] of languages) {
    const filePath = path.join(localesDir, `${langCode}.json`);
    if (!fs.existsSync(filePath)) {
      needsTranslation.push([langCode, targetLang]);
      continue;
    }
    const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    if (JSON.stringify(existing) === JSON.stringify(enContent)) {
      needsTranslation.push([langCode, targetLang]);
    }
  }

  console.log(`📊 Languages to translate: ${needsTranslation.length}/${languages.length}\n`);

  let completed = 0;
  let skipped = 0;
  let failed = 0;
  let processed = 0;

  // Process in parallel batches
  for (let i = 0; i < needsTranslation.length; i += MAX_CONCURRENT) {
    const batch = needsTranslation.slice(i, i + MAX_CONCURRENT);
    const results = await processLanguagesInParallel(languages, batch);

    for (const result of results) {
      processed++;
      const progress = `[${processed}/${needsTranslation.length}]`;

      switch (result.status) {
        case 'success':
          console.log(`${progress} ✅ ${result.code.padEnd(8)} - Translated`);
          completed++;
          break;
        case 'skipped':
          console.log(`${progress} ⏭️  ${result.code.padEnd(8)} - Already translated`);
          skipped++;
          break;
        default:
          console.log(`${progress} ❌ ${result.code.padEnd(8)} - Failed`);
          failed++;
      }
    }

    if (i + MAX_CONCURRENT < needsTranslation.length) {
      await delay(500); // Pause between batches
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`  ✅ Translated: ${completed}`);
  console.log(`  ⏭️  Skipped: ${skipped}`);
  console.log(`  ❌ Failed: ${failed}`);
  console.log(`  📊 Total: ${languages.length}`);
}

main().catch(console.error);
