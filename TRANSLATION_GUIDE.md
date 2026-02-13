# StockFx Translation Management Guide

## Overview

StockFx supports **100 languages** with a phased translation approach:

- **Tier 1 (Fully Translated):** 15 languages with complete, professional translations
- **Tier 2 (In Progress):** 85 languages with structural templates ready for translation
- **Fallback:** All languages gracefully fall back to English if a key is missing

## Supported Languages

### ✅ Fully Translated (Tier 1) - 15 Languages
Production-ready, fully translated interfaces:
- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Simplified Chinese (zh)
- Portuguese (pt)
- Italian (it)
- Russian (ru)
- Japanese (ja)
- Korean (ko)
- Dutch (nl)
- Polish (pl)
- Turkish (tr)
- Swedish (sv)
- Norwegian (no)

### 🚀 Coming Soon (Tier 2) - 85 Languages
Structure in place, awaiting professional translations:

**Eastern European (10):** Czech, Hungarian, Polish, Romanian, Slovak, Slovenian, Croatian, Serbian, Bulgarian, Ukrainian, Estonian, Latvian, Lithuanian

**Middle East & North Africa (2):** Hebrew, Arabic

**South & East Asia (20):** Bengali, Hindi, Tamil, Telugu, Kannada, Malayalam, Marathi, Gujarati, Telugu, Odia, Assamese, Thai, Vietnamese, Indonesian, Filipino, Malay

**Sub-Saharan Africa (8):** Afrikaans, Zulu, Swahili, Malagasy, Chichewa

**Western Europe (10):** Danish, Finnish, Greek, Catalan, Galician, Basque, Maltese, and others

**And 35+ more languages...**

## File Structure

```
src/i18n/
├── config.ts              # i18n configuration
├── languages.ts           # All 100 language definitions
├── createLocaleFiles.ts   # Helper script to generate files
├── locales/
│   ├── en.json           # English (base language)
│   ├── es.json           # Spanish (translated)
│   ├── fr.json           # French (translated)
│   │ ... (13 more translated languages)
│   ├── da.json           # Danish (template - needs translation)
│   ├── fi.json           # Finnish (template)
│   │ ... (83 more template files)
```

## Translation Keys Structure

Each locale file contains the following key groups:

### Navigation
```
nav.signIn
nav.getStarted
```

### Hero Section
```
hero.badge
hero.title1
hero.title2
hero.description
hero.startButton
hero.signInButton
```

### Features
```
features.title
features.fast.name
features.fast.desc
features.security.name
... (etc for each feature)
```

### Testimonials
```
testimonials.title
testimonials.subtitle
```

### Stats
```
stats.investors
stats.assets
stats.commission
stats.uptime
```

### Pricing
```
pricing.title
pricing.subtitle
pricing.starter.name
pricing.starter.price
pricing.starter.desc
... (plus 'pro' and 'enterprise' tiers)
pricing.features.* (18 different features)
pricing.button
```

### Trust Section
```
trust.title
trust.security.name
trust.security.desc
trust.insured.name
trust.insured.desc
trust.compliant.name
trust.compliant.desc
```

### CTA
```
cta.title
cta.subtitle
cta.button
```

### Footer
```
footer.description
footer.platform
footer.company
footer.legal
footer.social
footer.features
footer.pricing
footer.security
footer.about
footer.blog
footer.contact
footer.privacy
footer.terms
footer.disclosures
footer.twitter
footer.linkedin
footer.youtube
footer.copyright
```

### Contact Modal
```
contact.title
contact.message
contact.contact
contact.later
```

### Login Page
```
login.title
login.subtitle
login.emailLabel
login.emailPlaceholder
login.passwordLabel
login.passwordPlaceholder
login.signInButton
login.noAccount
login.backToHome
login.serverChecking
login.serverUp
login.thirdParty
login.thirdPartyDisabled
```

### Register Page
```
register.title
register.subtitle
register.haveAccount
register.firstNameLabel
register.firstNamePlaceholder
register.lastNameLabel
register.lastNamePlaceholder
register.emailLabel
register.emailPlaceholder
register.passwordLabel
register.passwordPlaceholder
register.passwordHelper
register.termsLabel
register.terms
register.and
register.privacy
register.createButton
register.verifyTitle
register.verifyPlaceholder
register.verifyError
register.devCode
register.changeEmail
register.resendCode
register.resendCooldown
register.verifyButton
```

### Dashboard (40+ keys)
```
dashboard.loading
dashboard.notAuthenticated
dashboard.goToLogin
dashboard.signOut
dashboard.yourHoldings
dashboard.portfolioSummary
... (and many more)
```

**Total: ~150 translation keys**

---

## How to Add New Translations

### Option 1: Manual Translation

1. **Open the locale file** (e.g., `src/i18n/locales/da.json`)

2. **Replace each English value** with translation in target language:

```json
{
  "nav": {
    "signIn": "Sing ind",           // Changed from "Sign In"
    "getStarted": "Kom i gang"      // Changed from "Get Started"
  },
  // ... continue for all keys
}
```

3. **Test the translation** in the app:
   - Select the language from the language switcher
   - Verify all text displays correctly
   - Check for text overflow in UI elements

### Option 2: Automated Translation (Recommended for Scale)

Use a translation API service:

#### Using Google Translate API

```bash
npm install @google-cloud/translate
```

```typescript
// scripts/translate-language.ts
import translate from '@google-cloud/translate';

const client = new translate.Translate({
  projectId: 'your-project-id',
});

async function translateContent(language: string) {
  const sourceFile = require('../src/i18n/locales/en.json');
  
  const translateValue = async (value: any): Promise<any> => {
    if (typeof value === 'string') {
      const [translations] = await client.translate(value, language);
      return translations;
    } else if (typeof value === 'object' && value !== null) {
      const result: Record<string, any> = {};
      for (const [key, val] of Object.entries(value)) {
        result[key] = await translateValue(val);
      }
      return result;
    }
    return value;
  };

  return await translateValue(sourceFile);
}
```

#### Using DeepL API (Higher Quality)

```bash
npm install deepl
```

```typescript
import * as deepl from 'deepl';

const translator = new deepl.Translator('api-key-here');

async function translateContent(targetLang: string) {
  const sourceFile = require('../src/i18n/locales/en.json');
  
  const translateValue = async (value: any): Promise<any> => {
    if (typeof value === 'string' && value.length > 0) {
      const result = await translator.translateText(value, null, targetLang);
      return result.text;
    } else if (typeof value === 'object' && value !== null) {
      const result: Record<string, any> = {};
      for (const [key, val] of Object.entries(value)) {
        result[key] = await translateValue(val);
      }
      return result;
    }
    return value;
  };

  return await translateValue(sourceFile);
}
```

---

## Integration with Package.json

Add convenience scripts to `package.json`:

```json
{
  "scripts": {
    "i18n:generate": "ts-node src/i18n/createLocaleFiles.ts",
    "i18n:validate": "ts-node src/i18n/validateTranslations.ts",
    "i18n:translate:google": "ts-node scripts/google-translate.ts --lang=da",
    "i18n:translate:deepl": "ts-node scripts/deepl-translate.ts --lang=da"
  }
}
```

---

## Testing Translations

### Manual Testing Checklist

- [ ] Open app in browser
- [ ] Select language from language switcher
- [ ] Verify all page sections display correctly:
  - [ ] Navigation
  - [ ] Hero section
  - [ ] Features
  - [ ] Testimonials
  - [ ] Pricing
  - [ ] FAQ
  - [ ] Footer
- [ ] Test login page
- [ ] Test register page
- [ ] Test dashboard pages
- [ ] Check for text overflow or layout issues
- [ ] Verify links still work
- [ ] Test language switching multiple times

### Automated Testing

```typescript
// src/i18n/__tests__/translations.test.ts
import enTranslations from '../locales/en.json';
import esTranslations from '../locales/es.json';
// ... import all languages

describe('Translations', () => {
  it('should have same key structure in all languages', () => {
    const enKeys = Object.keys(enTranslations).sort();
    const esKeys = Object.keys(esTranslations).sort();
    
    expect(esKeys).toEqual(enKeys);
  });

  it('should not have missing translations', () => {
    const testLanguages = [esTranslations, frTranslations, deTranslations];
    
    testLanguages.forEach(lang => {
      Object.entries(lang).forEach(([key, value]) => {
        expect(value).toBeDefined();
        if (typeof value === 'object') {
          Object.entries(value).forEach(([subKey, subValue]) => {
            expect(subValue).not.toBeNull();
          });
        }
      });
    });
  });
});
```

---

## Deployment Workflow

### 1. **Development**: Complete translations in feature branch
```bash
# Create feature branch
git checkout -b feature/add-danish-translation

# Add translations
# Test locally
npm run i18n:validate

# Commit
git commit -m "feat: Add Danish translation (da)"
```

### 2. **Production Release**: Merge to main
```bash
# Create pull request
# Reviewers verify language is complete and correct
# Merge to main

# Build and deploy
npm run build
npm run deploy
```

### 3. **Monitoring**: Check for missing keys
```bash
# Monitor logs for missing translation keys
# Users experiencing issues with untranslated text

# Quickly add missing keys
git hotfix ...
```

---

## Priority Roadmap

### Phase 1 (Q1 2026): Core Markets
- Hindi (600M speakers)
- Indonesian (200M speakers)
- Portuguese Brazil variant (200M speakers)
- Arabic (400M speakers)
- Vietnamese (100M speakers)

### Phase 2 (Q2 2026): Growing Markets
- Turkish, Thai, Malay, Korean variants
- Central Eastern European languages
- African languages (South Africa focus)

### Phase 3 (Q3 2026): Long Tail
- Remaining 75 languages
- Regional variants (pt-BR, zh-TW, etc.)
- Specialized terminology for each market

---

## Common Issues & Solutions

### Issue: Translation keys show as `[object Object]`
**Solution:** Ensure all values in JSON are strings, not nested objects (except for grouped keys)

### Issue: Text overflow in UI
**Solution:** Some languages need more space. Test with German/Finnish which tend to be longer. Consider:
- Reducing font size for certain languages
- Adjusting padding/margins
- Using abbreviated versions for UI buttons

### Issue: RTL languages (Arabic, Hebrew)
**Solution:** Need special CSS handling:
```css
[dir="rtl"] {
  direction: rtl;
  text-align: right;
}
```

### Issue: Character encoding issues
**Solution:** Ensure all JSON files are saved as UTF-8:
```bash
file src/i18n/locales/*.json
# Should show: UTF-8 Unicode
```

---

## Contributing Translations

We welcome community translations! Steps:

1. Fork the repository
2. Create language file or improve existing one
3. Run validation: `npm run i18n:validate`
4. Test in browser
5. Submit pull request with language code in title

Example PR title: `feat: Add Hindi translation (hi)`

---

## Support

For questions about translations or missing languages, please:
- Open an issue on GitHub
- Contact: translations@stockfx.com
- Join our translation community: https://translate.stockfx.com

---

*Last Updated: February 13, 2026*
