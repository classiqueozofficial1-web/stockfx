/**
 * Translation File Generator Utility
 * 
 * This utility generates locale JSON files for all supported languages.
 * It can be run as a Node.js script to create/update translation files.
 * 
 * Usage:
 * npx ts-node src/i18n/createLocaleFiles.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { SUPPORTED_LANGUAGES } from './languages';
import enTranslations from './locales/en.json';

// Languages that are already fully translated
const FULLY_TRANSLATED = ['en', 'es', 'fr', 'de', 'zh', 'pt', 'it', 'ru', 'ja', 'ko', 'nl', 'pl', 'tr', 'sv', 'no'];

/**
 * Language names in their native script for reference
 * This helps translators understand which language they're translating
 */
const LANGUAGE_REFERENCE: Record<string, string> = {
  da: 'Danish', fi: 'Finnish', el: 'Greek', hu: 'Hungarian', cs: 'Czech',
  ro: 'Romanian', sk: 'Slovak', sl: 'Slovenian', hr: 'Croatian', sr: 'Serbian',
  bg: 'Bulgarian', uk: 'Ukrainian', et: 'Estonian', lv: 'Latvian', lt: 'Lithuanian',
  he: 'Hebrew', ar: 'Arabic', th: 'Thai', vi: 'Vietnamese', id: 'Indonesian',
  ms: 'Malay', tl: 'Filipino', bn: 'Bengali', hi: 'Hindi', ta: 'Tamil',
  te: 'Telugu', kn: 'Kannada', ml: 'Malayalam', ur: 'Urdu', fa: 'Persian',
  af: 'Afrikaans', zu: 'Zulu', sw: 'Swahili', mg: 'Malagasy', ny: 'Chichewa',
  mt: 'Maltese', ca: 'Catalan', gl: 'Galician', eu: 'Basque', sq: 'Albanian',
  mk: 'Macedonian', be: 'Belarusian', hy: 'Armenian', ka: 'Georgian', az: 'Azerbaijani',
  kk: 'Kazakh', ky: 'Kyrgyz', uz: 'Uzbek', tk: 'Turkmen', mn: 'Mongolian',
  bo: 'Tibetan', my: 'Burmese', km: 'Khmer', lo: 'Lao', si: 'Sinhala',
  ne: 'Nepali', gu: 'Gujarati', pa: 'Punjabi', mr: 'Marathi', or: 'Odia',
  as: 'Assamese', mai: 'Maithili', sat: 'Santali', sd: 'Sindhi', ps: 'Pashto',
  ak: 'Akan', am: 'Amharic', om: 'Oromo', ti: 'Tigrinya'
};

/**
 * Create a locale file with a TRANSLATION NEEDED notice
 * This provides translators with context about what needs to be translated
 */
function createLocaleFileWithNotice(languageCode: string, languageName: string): string {
  const translationNotice = {
    "_meta": {
      "language": languageCode,
      "languageName": languageName,
      "translationStatus": "NEEDS_TRANSLATION",
      "note": `This language file needs to be translated from English. Translator: Please replace all English text with ${languageName} translations. Keep the JSON structure identical. See TRANSLATION_GUIDE.md for context about each field.`,
      "createdDate": new Date().toISOString()
    },
    ...enTranslations
  };
  
  return JSON.stringify(translationNotice, null, 2);
}

/**
 * Generate all missing locale files
 */
function generateMissingLocales() {
  const localesDir = path.join(__dirname, 'locales');
  
  // Create locales directory if it doesn't exist
  if (!fs.existsSync(localesDir)) {
    fs.mkdirSync(localesDir, { recursive: true });
  }

  let created = 0;
  let skipped = 0;
  const results: { language: string; status: string }[] = [];

  SUPPORTED_LANGUAGES.forEach(lang => {
    const filePath = path.join(localesDir, `${lang.code}.json`);
    
    // Skip if already exists and is translated
    if (fs.existsSync(filePath) && FULLY_TRANSLATED.includes(lang.code)) {
      skipped++;
      results.push({ language: lang.code, status: 'SKIPPED (already translated)' });
      return;
    }

    // Create file with translation notice
    if (!fs.existsSync(filePath) || !FULLY_TRANSLATED.includes(lang.code)) {
      try {
        const content = createLocaleFileWithNotice(lang.code, lang.nativeName);
        fs.writeFileSync(filePath, content, 'utf-8');
        created++;
        results.push({ language: lang.code, status: 'CREATED' });
      } catch (error) {
        console.error(`Error creating ${lang.code}.json:`, error);
        results.push({ language: lang.code, status: `ERROR: ${error}` });
      }
    }
  });

  return { created, skipped, total: SUPPORTED_LANGUAGES.length, results };
}

/**
 * Validate all locale files have the same structure
 */
function validateLocaleStructure() {
  const localesDir = path.join(__dirname, 'locales');
  const referenceKeys = Object.keys(enTranslations);
  const issues: string[] = [];

  SUPPORTED_LANGUAGES.forEach(lang => {
    const filePath = path.join(localesDir, `${lang.code}.json`);
    
    if (!fs.existsSync(filePath)) {
      issues.push(`❌ Missing file: ${lang.code}.json`);
      return;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(content);
      
      // Remove meta field if present
      const dataKeys = Object.keys(data).filter(k => k !== '_meta');
      
      // Check if keys match
      if (JSON.stringify(dataKeys.sort()) !== JSON.stringify(referenceKeys.sort())) {
        issues.push(`⚠️ Structure mismatch in ${lang.code}.json`);
      } else {
        console.log(`✅ ${lang.code}.json - Structure valid`);
      }
    } catch (error) {
      issues.push(`❌ Invalid JSON in ${lang.code}.json: ${error}`);
    }
  });

  return issues;
}

// Run if executed directly
if (require.main === module) {
  console.log('🌍 StockFx Translation File Generator\n');
  console.log('📝 Generating missing locale files...\n');

  const result = generateMissingLocales();
  
  console.log(`✅ Created: ${result.created}`);
  console.log(`⏭️  Skipped: ${result.skipped}`);
  console.log(`📊 Total: ${result.total}\n`);

  console.log('Detailed results:');
  result.results.forEach(r => {
    const icon = r.status.includes('CREATED') ? '✨' : r.status.includes('SKIPPED') ? '⏭️' : '❌';
    console.log(`${icon} ${r.language.padEnd(6)} - ${r.status}`);
  });

  console.log('\n📋 Validating translation structure...\n');
  const issues = validateLocaleStructure();
  
  if (issues.length === 0) {
    console.log('✅ All translation files have valid structure!\n');
  } else {
    console.log('Issues found:');
    issues.forEach(issue => console.log(issue));
    console.log();
  }

  console.log('✅ Translation file generation complete!');
  console.log('\n📚 Next steps:');
  console.log('1. Use Google Translate API or professional translator to fill in actual translations');
  console.log('2. See TRANSLATION_GUIDE.md for context and guidelines');
  console.log('3. Update config.ts to import all language files');
}

export { generateMissingLocales, validateLocaleStructure, FULLY_TRANSLATED };
