const fs = require('fs');
const path = require('path');

const HOST = 'jsontools.space';
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// The key file itself is the source of truth (its name IS the key) — avoids
// keeping the key duplicated in a second place that could drift out of sync.
const keyFile = fs.readdirSync(PUBLIC_DIR).find(f => /^[0-9a-fA-F]{8,128}\.txt$/.test(f));
if (!keyFile) throw new Error(`No IndexNow key file found in ${PUBLIC_DIR}`);
const key = path.basename(keyFile, '.txt');
const keyLocation = `https://${HOST}/${keyFile}`;

async function getAllSitemapUrls() {
  const res = await fetch(`https://${HOST}/sitemap.xml`);
  if (!res.ok) throw new Error(`Failed to fetch sitemap: ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
}

async function main() {
  // Explicit paths (e.g. "/tools/new-tool") submit just those; no args submits everything in the sitemap.
  const args = process.argv.slice(2);
  const urlList = args.length > 0
    ? args.map(p => `https://${HOST}${p.startsWith('/') ? p : `/${p}`}`)
    : await getAllSitemapUrls();

  console.log(`Submitting ${urlList.length} URL(s) to IndexNow...`);

  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key, keyLocation, urlList }),
  });

  const body = await res.text();
  console.log(`Response: ${res.status} ${res.statusText}${body ? `\n${body}` : ''}`);
  if (!res.ok) process.exitCode = 1;
}

main();
