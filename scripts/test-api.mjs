import https from 'https';

function testAPI() {
  return new Promise((resolve) => {
    const url = 'https://api.mymemory.translated.net/get?q=Sign%20In&langpair=en|ro';
    
    https.get(url, { timeout: 8000 }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('API Response:');
          console.log('Status:', result.responseStatus);
          console.log('English: Sign In');
          console.log('Romanian:', result.responseData.translatedText);
          resolve();
        } catch (e) {
          console.error('Error parsing response:', e.message);
          resolve();
        }
      });
    }).on('error', (e) => { console.error('Request error:', e.message); resolve(); });
  });
}

testAPI();
