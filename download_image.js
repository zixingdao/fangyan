const fs = require('fs');
const https = require('https');
const path = require('path');

const url = "https://images.unsplash.com/photo-1620967569550-b52179684061?q=80&w=2574&auto=format&fit=crop";
const dest = path.join(__dirname, 'apps/client/src/assets/images/changsha-bg.jpg');

const file = fs.createWriteStream(dest);

https.get(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  }
}, (response) => {
  if (response.statusCode !== 200) {
    console.error(`Failed to download: ${response.statusCode}`);
    process.exit(1);
  }
  response.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('Download completed');
  });
}).on('error', (err) => {
  fs.unlink(dest, () => {});
  console.error(`Error: ${err.message}`);
  process.exit(1);
});