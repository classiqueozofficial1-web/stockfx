import fs from 'fs';
import https from 'https';

const enContent = JSON.parse(fs.readFileSync('src/i18n/locales/en.json', 'utf-8'));

function translateText(text, targetLang) {
  return new Promise((resolve) => {
    const query = encodeURIComponent(text);
    const url = `https://api.mymemory.translated.net/get?q=${query}&langpair=en|${targetLang}`;
    
    const req = https.get(url, { timeout: 8000 }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result.responseData.translatedText || text);
        } catch (e) {
          resolve(text);
        }
      });
    });
    
    req.on('error', () => resolve(text));
    req.on('timeout', () => { req.destroy(); resolve(text); });
  });
}

async function translateObject(obj, targetLang) {
  const result = {};
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      result[key] = await translateObject(obj[key], targetLang);
    } else if (typeof obj[key] === 'string') {
      result[key] = await translateText(obj[key], targetLang);
      await new Promise(resolve => setTimeout(resolve, 150));
    }
  }
  return result;
}

(async () => {
  console.log('🇷🇴 Translating Romanian...');
  const roContent = await translateObject(enContent, 'ro');
  fs.writeFileSync('src/i18n/locales/ro.json', JSON.stringify(roContent, null, 2) + '\n', 'utf-8');
  console.log('✅ Romanian translation complete!');
  console.log('Sample: "Sign In" =>', roContent.nav.signIn);
})();
