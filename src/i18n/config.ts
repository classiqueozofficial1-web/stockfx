import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from './languages';

// ============================================================
// DYNAMICALLY IMPORT ALL LOCALE FILES (100 LANGUAGES)
// Using Vite's glob import for proper module resolution
// ============================================================
const localeModules = import.meta.glob<{ default: Record<string, any> }>(
  './locales/*.json',
  { eager: true }
);

// Extract language code from file path and build translations map
const allTranslations: Record<string, any> = {};

for (const [path, module] of Object.entries(localeModules)) {
  // Extract language code from path: './locales/en.json' -> 'en'
  const match = path.match(/\/locales\/([a-z-]+)\.json$/);
  if (match && match[1]) {
    const langCode = match[1];
    allTranslations[langCode] = module.default;
  }
}

// ============================================================
// BUILD RESOURCE MAP FOR ALL 100 LANGUAGES
// ============================================================
const resources: Record<string, any> = {};

SUPPORTED_LANGUAGES.forEach(lang => {
  // Use loaded translation or fallback to English
  const translation = allTranslations[lang.code] || allTranslations['en'];
  resources[lang.code] = { translation };
});

// Get saved language from localStorage or detect browser language
const getSavedLanguage = () => {
  const saved = localStorage.getItem('language');
  const supportedCodes = SUPPORTED_LANGUAGES.map(l => l.code);
  
  if (saved && supportedCodes.includes(saved)) {
    return saved;
  }

  // Try to detect browser language
  const browserLang = navigator.language.split('-')[0];
  return supportedCodes.includes(browserLang) ? browserLang : 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getSavedLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
