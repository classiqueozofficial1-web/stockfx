#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TRANSLATED = ['en', 'es', 'fr', 'de', 'zh', 'pt', 'it', 'ru', 'ja', 'ko', 'nl', 'pl', 'tr', 'sv', 'no'];

// All 100 supported language codes (from languages.ts)
const LANGUAGES = [
  'en', 'es', 'fr', 'de', 'zh', 'it', 'pt', 'ru', 'ja', 'ko', 'nl', 'pl', 'tr', 'sv', 'no',
  'da', 'fi', 'el', 'hu', 'cs', 'ro', 'sk', 'sl', 'hr', 'sr', 'bg', 'uk', 'et', 'lv', 'lt',
  'he', 'ar', 'th', 'vi', 'id', 'ms', 'tl', 'bn', 'hi', 'ta', 'te', 'kn', 'ml', 'ur', 'fa',
  'af', 'zu', 'sw', 'mg', 'ny', 'mt', 'ca', 'gl', 'eu', 'sq', 'mk', 'be', 'hy', 'ka', 'az',
  'kk', 'ky', 'uz', 'tk', 'mn', 'bo', 'my', 'km', 'lo', 'si', 'ne', 'gu', 'pa', 'mr', 'or',
  'as', 'mai', 'sat', 'sd', 'ps', 'ak', 'am', 'om', 'ti', 'en-gb', 'en-au', 'en-in', 'pt-br',
  'es-mx', 'es-ar', 'fr-ca', 'de-at', 'de-ch', 'it-ch', 'zh-tw', 'ar-ae', 'ar-eg', 'sr-latn',
  'ff', 'rw'
];

const localesDir = path.join(__dirname, '../src/i18n/locales');
const enFile = path.join(localesDir, 'en.json');

function main() {
  console.log('🌍 StockFx Locale File Generator\n');
  
  if (!fs.existsSync(localesDir)) {
    fs.mkdirSync(localesDir, { recursive: true });
  }

  const eng = JSON.parse(fs.readFileSync(enFile, 'utf-8'));
  let created = 0, skipped = 0;

  LANGUAGES.forEach(lang => {
    const filePath = path.join(localesDir, `${lang}.json`);
    
    if (fs.existsSync(filePath) && TRANSLATED.includes(lang)) {
      console.log(`⏭️  ${lang.padEnd(6)} - Already translated`);
      skipped++;
      return;
    }

    fs.writeFileSync(filePath, JSON.stringify(eng, null, 2), 'utf-8');
    console.log(`✨ ${lang.padEnd(6)} - Created`);
    created++;
  });

  console.log(`\n✅ Created: ${created} | Skipped: ${skipped} | Total: ${LANGUAGES.length}`);
}

main();
