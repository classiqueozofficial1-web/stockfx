# StockFx Translation (i18n) System Review

**Date:** February 13, 2026  
**Status:** ⚠️ CONFIGURATION MISMATCH DETECTED

---

## Executive Summary

The StockFx translation system has a **major configuration mismatch**:
- **Claims to support:** 100 languages
- **Actually translated:** 15 languages only
- **Fallback support:** 85 languages (uses English as fallback)

---

## 1. Translation System Architecture

### File Structure
```
src/i18n/
├── config.ts          # i18n configuration and initialization
├── languages.ts       # List of all 100 supported languages
└── locales/
    ├── en.json       # English (main language)
    ├── es.json       # Spanish
    ├── fr.json       # French
    ├── de.json       # German
    ├── zh.json       # Simplified Chinese
    ├── pt.json       # Portuguese
    ├── it.json       # Italian
    ├── ru.json       # Russian
    ├── ja.json       # Japanese
    ├── ko.json       # Korean
    ├── nl.json       # Dutch
    ├── pl.json       # Polish
    ├── tr.json       # Turkish
    ├── sv.json       # Swedish
    └── no.json       # Norwegian
```

### Key Components

#### 1. **src/i18n/config.ts** - Configuration
- Initializes i18next with react-i18next
- Imports translation files for **15 languages only**
- Creates resource map with fallback to English for unsupported languages
- Auto-detects browser language on first load
- Persists user language selection in localStorage

#### 2. **src/i18n/languages.ts** - Language Definitions
- Defines **100 languages** with:
  - Language code (e.g., 'en', 'es')
  - English name (e.g., 'Spanish')
  - Native name (e.g., 'Español')
  - Flag emoji (e.g., '🇪🇸')

#### 3. **src/components/LanguageSwitcher.tsx** - UI Component
- Globe icon button with current language flag
- Searchable dropdown with all 100 languages
- Real-time filtering by name, native name, or code
- Shows translation count (e.g., "15 of 100 languages")
- Updates localStorage on language change

#### 4. **src/pages/LandingPage.tsx** - Usage Example
- Uses `const { t } = useTranslation()`
- Calls translation keys like `t('nav.getStarted')`, `t('hero.title1')`, etc.

---

## 2. Language Support Status

### ✅ Fully Translated (15 languages)

| Code | Name | Native Name | Flag |
|------|------|-------------|------|
| en | English | English | 🇺🇸 |
| es | Spanish | Español | 🇪🇸 |
| fr | French | Français | 🇫🇷 |
| de | German | Deutsch | 🇩🇪 |
| zh | Chinese (Simplified) | 中文 | 🇨🇳 |
| it | Italian | Italiano | 🇮🇹 |
| pt | Portuguese | Português | 🇵🇹 |
| ru | Russian | Русский | 🇷🇺 |
| ja | Japanese | 日本語 | 🇯🇵 |
| ko | Korean | 한국어 | 🇰🇷 |
| nl | Dutch | Nederlands | 🇳🇱 |
| pl | Polish | Polski | 🇵🇱 |
| tr | Turkish | Türkçe | 🇹🇷 |
| sv | Swedish | Svenska | 🇸🇪 |
| no | Norwegian | Norsk | 🇳🇴 |

### ⚠️ Fallback Only (85 languages)

All other languages from the `SUPPORTED_LANGUAGES` array use **English as fallback**:

**European (15):** Danish, Finnish, Greek, Hungarian, Czech, Romanian, Slovak, Slovenian, Croatian, Serbian, Bulgarian, Ukrainian, Estonian, Latvian, Lithuanian

**Middle Eastern & Asian (20):** Hebrew, Arabic, Thai, Vietnamese, Indonesian, Malay, Filipino, Bengali, Hindi, Tamil, Telugu, Kannada, Malayalam, Urdu, Persian, Nepali, Gujarati, Punjabi, Marathi, Odia

**African (8):** Assamese, Afrikaans, Zulu, Swahili, Malagasy, Chichewa, Akan, Amharic, Oromo, Tigrinya

**Other (42):** Catalan, Galician, Basque, Albanian, Macedonian, Belarusian, Armenian, Georgian, Azerbaijani, Kazakh, Kyrgyz, Uzbek, Turkmen, Mongolian, Tibetan, Burmese, Khmer, Lao, Sinhala, Sindhi, Pashto, Maltese, and others

---

## 3. Translation Keys Documentation

### Complete Key Structure (from en.json)

```
📌 Navigation
├── nav.signIn
├── nav.getStarted

📌 Hero Section
├── hero.badge
├── hero.title1
├── hero.title2
├── hero.description
├── hero.startButton
├── hero.signInButton

📌 Features
├── features.title
├── features.fast.name
├── features.fast.desc
├── features.security.name
├── features.security.desc
├── features.mobile.name
├── features.mobile.desc
├── features.global.name
├── features.global.desc

📌 Testimonials
├── testimonials.title
├── testimonials.subtitle

📌 Stats
├── stats.investors
├── stats.assets
├── stats.commission
├── stats.uptime

📌 Pricing
├── pricing.title
├── pricing.subtitle
├── pricing.starter.name
├── pricing.starter.price
├── pricing.starter.desc
├── pricing.starter.duration
├── pricing.pro.name
├── pricing.pro.price
├── pricing.pro.desc
├── pricing.pro.duration
├── pricing.pro.popular
├── pricing.enterprise.name
├── pricing.enterprise.price
├── pricing.enterprise.desc
├── pricing.enterprise.duration
├── pricing.button
├── pricing.features.* (18 features)

📌 Trust & Security
├── trust.title
├── trust.security.name
├── trust.security.desc
├── trust.insured.name
├── trust.insured.desc
├── trust.compliant.name
├── trust.compliant.desc

📌 Call-to-Action
├── cta.title
├── cta.subtitle
├── cta.button

📌 Footer
├── footer.description
├── footer.platform
├── footer.company
├── footer.legal
├── footer.social
├── footer.features
├── footer.pricing
├── footer.security
├── footer.about
├── footer.blog
├── footer.contact
├── footer.privacy
├── footer.terms
├── footer.disclosures
├── footer.twitter
├── footer.linkedin
├── footer.youtube
├── footer.copyright

📌 Contact Modal
├── contact.title
├── contact.message
├── contact.contact
├── contact.later

📌 Login Page
├── login.title
├── login.subtitle
├── login.emailLabel
├── login.emailPlaceholder
├── login.passwordLabel
├── login.passwordPlaceholder
├── login.signInButton
├── login.noAccount
├── login.backToHome
├── login.serverChecking
├── login.serverUp
├── login.thirdParty
├── login.thirdPartyDisabled

📌 Register Page
├── register.title
├── register.subtitle
├── register.haveAccount
├── register.firstNameLabel
├── register.firstNamePlaceholder
├── register.lastNameLabel
├── register.lastNamePlaceholder
├── register.emailLabel
├── register.emailPlaceholder
├── register.passwordLabel
├── register.passwordPlaceholder
├── register.passwordHelper
├── register.termsLabel
├── register.terms
├── register.and
├── register.privacy
├── register.createButton
├── register.verifyTitle
├── register.verifyPlaceholder
├── register.verifyError
├── register.devCode
├── register.changeEmail
├── register.resendCode
├── register.resendCooldown
├── register.verifyButton

📌 Dashboard
├── dashboard.loading
├── dashboard.notAuthenticated
├── dashboard.goToLogin
├── dashboard.signOut
├── dashboard.yourHoldings
├── dashboard.portfolioSummary
├── dashboard.totalValue
├── dashboard.unrealizedGains
├── dashboard.return
├── dashboard.allocation
├── dashboard.assets
├── dashboard.performance
├── dashboard.welcome
├── dashboard.accountCreated
├── dashboard.emailAddress
├── dashboard.accountStatus
├── dashboard.active
├── dashboard.currentBalance
├── dashboard.overviewTab
├── dashboard.portfolioTab
├── dashboard.settingsTab
├── dashboard.accountSettings
├── dashboard.manageAccount
├── dashboard.profileInformation
├── dashboard.fullName
├── dashboard.security
├── dashboard.newPassword
├── dashboard.leaveBlank
├── dashboard.preferences
├── dashboard.emailNotifications
├── dashboard.priceAlerts
├── dashboard.marketingEmails
├── dashboard.saveChanges
├── dashboard.cancel
├── dashboard.noChanges
├── dashboard.settingsUpdated
├── dashboard.failedToSave
├── dashboard.searchAssets
├── dashboard.notifications
├── dashboard.noNotifications
├── dashboard.totalBalance
├── dashboard.totalProfit
├── dashboard.monthlyIncome
├── dashboard.activeInvestments
├── dashboard.marketWatchlist
├── dashboard.viewAll
├── dashboard.quickTransfer
├── dashboard.transferMessage
├── dashboard.send
├── dashboard.addMoney
├── dashboard.recentActivity
├── dashboard.viewAllHistory
├── dashboard.assetAllocation
├── dashboard.totalAssets
├── dashboard.stocks
├── dashboard.crypto
├── dashboard.etfs
├── dashboard.cash
├── dashboard.shares
├── dashboard.yesterday
├── dashboard.investPro
├── dashboard.topHoldings
```

**Total Translation Keys:** ~150 keys across all namespaces

---

## 4. Component Integration

### How It Works

1. **LanguageSwitcher.tsx** provides the UI for language selection
   - Reads current language from `i18n.language`
   - Changes language via `i18n.changeLanguage(lang)`
   - Persists choice to localStorage

2. **LandingPage.tsx** and other pages use translations
   - Imports `useTranslation()` hook
   - Calls `t()` function with key paths

3. **config.ts** initializes the system
   - Loads translation files
   - Creates fallback map
   - Restores user's previous language choice

---

## 5. Issues Found

### ⚠️ Issue 1: Language Support Mismatch
**Severity:** High ⚠️

**Problem:**
- UI shows "15 of 100 languages" but suggests all 100 are fully supported
- Users selecting unsupported languages get English interface
- Creates false expectation of support

**Impact:**
- Users from 85+ countries see English UI instead of their native language
- Misleading UX

**Recommendation:**
- Either remove unsupported languages or provide translations
- Update UI message to be honest (e.g., "15 fully translated languages")
-Consider: Add note in dropdown like "⭐ Fully translated" next to supported languages

---

### ⚠️ Issue 2: Missing Translation Files for Imported Languages
**Severity:** Medium ⚠️

**Problem:**
- `config.ts` only imports 15 language files
- `languages.ts` lists 100 languages
- No translations exist for 85 languages

**Current Behavior:**
- Code loads successfully ✅
- Unsupported languages silently fall back to English ✅
- No error messages or warnings ❌

**Recommendation:**
- Create stub files for missing languages (minimal effort)
- Or add validation to warn developers of missing translations
- Document which languages are "coming soon"

---

### ⚠️ Issue 3: Incomplete Key Coverage
**Severity:** Low ✅ (Currently OK)

**Status:**
- All 15 translation files appear to have identical key structures ✅
- No missing or extra keys detected ✅
- Complete coverage of ~150 translation keys ✅

---

### ℹ️ Issue 4: Mobile Responsiveness
**Severity:** Low ℹ️

**Observation:**
- Language switcher button is responsive (hidden on mobile, full size on desktop)
- Dropdown modal is well-designed for mobile (92vw max-width)
- ✅ Good mobile UX

---

## 6. Recommendations & Action Items

### Priority 1: Fix the Language Support Discrepancy

**Option A: Honest Listing (Recommended)**
```typescript
// languages.ts - Split into two arrays
export const FULLY_TRANSLATED_LANGUAGES = [
  // Current 15 languages
];

export const FALLBACK_LANGUAGES = [
  // Remaining 85 languages
];

export const SUPPORTED_LANGUAGES = [
  ...FULLY_TRANSLATED_LANGUAGES,
  ...FALLBACK_LANGUAGES
];
```

**Option B: Remove Unsupported Languages (Most Drastic)**
```typescript
// languages.ts - Keep only fully translated
export const SUPPORTED_LANGUAGES = [
  // Current 15 languages only
];
```

**Option C: Phased Rollout (Best Long-term)**
- Mark languages as "coming soon"
- Gradually add translations over time
- Allows future expansion without code changes

---

### Priority 2: Update LanguageSwitcher UI

**Current:**
```
15 of 100 languages
```

**Suggested:**
```
15 fully translated | Others use English (fallback)
```

Or add visual indicators:
```
🌍 15 fully supported | 85 with English fallback
```

---

### Priority 3: Add Missing Locale Files (Low Effort)

If you want to truly support 100 languages, create fallback JSON files:

```bash
# Create script to generate fallback files
for lang in da fi el hu cs ro sk sl hr sr bg uk et lv lt...; do
  cp src/i18n/locales/en.json src/i18n/locales/$lang.json
done
```

Then update `config.ts` to import all 100 files dynamically.

---

### Priority 4: Implement Missing Language Translations

**Current Focus:** The 15 languages are fully translated ✅

**To Expand:**
- Use translation service (Google Translate API, DeepL, professional translators)
- Implement in phases (top 10 languages by market size next)
- Test translated interfaces in each language

**Suggested Priority Order:**
1. Portuguese (Brazil) - `pt-BR` (separate from `pt`)
2. Chinese (Traditional) - `zh-TW` (separate from `zh`)
3. Spanish (Latin America) variants
4. Hindi, Bengali, Indonesian (large user bases)
5. Others based on business metrics

---

## 7. Testing Checklist

### Manual Testing
```
☐ Switch between fully translated languages (15)
☐ Switch to non-translated language
☐ Verify English fallback works correctly
☐ Check localStorage persistence
☐ Verify browser language detection
☐ Test on mobile (iOS, Android)
☐ Test search in language switcher
☐ Verify all 150 translation keys display correctly
```

### Automated Testing
```
☐ Verify all keys exist in each translation file
☐ Check for untranslated strings (keys in code)
☐ Validate JSON structure
☐ Performance test with 100 languages
```

---

## 8. File Locations

| File | Purpose | Lines |
|------|---------|-------|
| `src/i18n/config.ts` | i18n setup & initialization | 77 |
| `src/i18n/languages.ts` | 100 language definitions | 88 |
| `src/components/LanguageSwitcher.tsx` | Language selection UI | 106 |
| `src/i18n/locales/en.json` | English translations | 239 |
| `src/i18n/locales/*.json` (14 others) | Translated content | 239 each |

---

## 9. Summary Statistics

| Metric | Value |
|--------|-------|
| Total Declared Languages | 100 |
| Fully Translated Languages | 15 |
| Fallback Languages | 85 |
| Total Translation Keys | ~150 |
| Translation Files Missing | 85 |
| Components Using i18n | ≥3 (LandingPage, LoginPage, RegisterPage) |
| Configuration Completeness | 15% (fully translated) |

---

## Conclusion

**The system is functionally correct** ✅ but has **misleading UX** ⚠️.

**Recommendation:** Update the UI to honestly reflect that only 15 languages have full translations, while 85 languages fall back to English. This sets proper user expectations and avoids disappointment.

If full 100-language support is a business goal, prioritize adding translations through a professional translation service, phased over quarters.

---

*Last Updated: February 13, 2026*
