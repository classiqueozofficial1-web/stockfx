#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Simple translation dictionary for key languages
const TRANSLATION_DICT = {
  'da': {
    'Sign In': 'Log ind',
    'Get Started': 'Kom i gang',
    'Zero-fee trading': 'Gebyrfri handel',
    'Your first $10,000': 'Dine første $10.000',
    'Invest Smarter.': 'Invester smartere.',
    'Grow Faster.': 'Voks hurtigere.',
    'Professional tools': 'Professionelle værktøjer',
    'Zero complexity': 'Nul kompleksitet',
  },
  'es': {
    'Sign In': 'Iniciar sesión',
    'Get Started': 'Empezar',
    'Zero-fee trading': 'Operaciones sin comisiones',
    'Your first $10,000': 'Tus primeros $10.000',
    'Invest Smarter.': 'Invierte con más inteligencia.',
    'Grow Faster.': 'Crece más rápido.',
    'Professional tools': 'Herramientas profesionales',
    'Zero complexity': 'Sin complejidad',
  },
  'fr': {
    'Sign In': 'Se connecter',
    'Get Started': 'Commencer',
    'Zero-fee trading': 'Transactions sans frais',
    'Your first $10,000': 'Vos premiers $10 000',
    'Invest Smarter.': 'Investissez plus intelligemment.',
    'Grow Faster.': 'Croître plus vite.',
    'Professional tools': 'Outils professionnels',
    'Zero complexity': 'Zéro complexité',
  },
  'de': {
    'Sign In': 'Anmelden',
    'Get Started': 'Loslegen',
    'Zero-fee trading': 'Gebührenfreier Handel',
    'Your first $10,000': 'Ihre ersten $10.000',
    'Invest Smarter.': 'Klüger investieren.',
    'Grow Faster.': 'Schneller wachsen.',
    'Professional tools': 'Professionelle Tools',
    'Zero complexity': 'Null Komplexität',
  },
  'zh': {
    'Sign In': '登录',
    'Get Started': '开始',
    'Zero-fee trading': '零费用交易',
    'Your first $10,000': '您的前$10,000',
    'Invest Smarter.': '更聪明地投资。',
    'Grow Faster.': '增长更快。',
    'Professional tools': '专业工具',
    'Zero complexity': '零复杂性',
  },
  'ja': {
    'Sign In': 'ログイン',
    'Get Started': '始まる',
    'Zero-fee trading': '手数料無料取引',
    'Your first $10,000': '最初の$10,000',
    'Invest Smarter.': 'より賢く投資してください。',
    'Grow Faster.': 'より速く成長します。',
    'Professional tools': 'プロフェッショナルツール',
    'Zero complexity': 'ゼロの複雑さ',
  },
};

const localesDir = path.join(__dirname, '../src/i18n/locales');
const enFile = path.join(localesDir, 'en.json');

function findAndTranslateStrings(obj, langDict) {
  const result = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      // Try to translate, fallback to English
      result[key] = langDict[value] || value;
    } else if (typeof value === 'object' && value !== null) {
      result[key] = findAndTranslateStrings(value, langDict);
    } else {
      result[key] = value;
    }
  }

  return result;
}

async function main() {
  console.log('📝 Adding Sample Translations\n');

  const enContent = JSON.parse(fs.readFileSync(enFile, 'utf-8'));

  let completed = 0;

  for (const [langCode, langDict] of Object.entries(TRANSLATION_DICT)) {
    const filePath = path.join(localesDir, `${langCode}.json`);
    
    try {
      const translated = findAndTranslateStrings(enContent, langDict);
      fs.writeFileSync(filePath, JSON.stringify(translated, null, 2), 'utf-8');
      console.log(`✅ ${langCode.padEnd(8)} - Added sample translations`);
      completed++;
    } catch (error) {
      console.log(`❌ ${langCode.padEnd(8)} - Failed: ${error.message}`);
    }
  }

  console.log(`\n📊 Added translations for ${completed} major languages`);
  console.log('💡 Other languages use English as fallback');
  console.log('📲 Use a service like Crowdin.com for full translations');
}

main().catch(console.error);
