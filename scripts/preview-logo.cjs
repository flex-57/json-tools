const { chromium } = require('../node_modules/playwright');
const path = require('path');
const fs = require('fs');

(async () => {
  const svgContent = fs.readFileSync(path.join(__dirname, '../public/logo-mark.svg'), 'utf8');
  const svgB64 = Buffer.from(svgContent).toString('base64');
  const src = `data:image/svg+xml;base64,${svgB64}`;

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 700, height: 220 });

  const html = `<!DOCTYPE html>
<html><head><style>
body { background: #13181F; display: flex; align-items: center; gap: 24px; padding: 40px; }
span { color: #4A5260; font-size: 10px; font-family: monospace; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 6px; }
</style></head>
<body>
  <span><img src="${src}" width="22" height="22">22px</span>
  <span><img src="${src}" width="30" height="30">30px (nav)</span>
  <span><img src="${src}" width="34" height="34">34px (footer)</span>
  <span><img src="${src}" width="44" height="44">44px (OG)</span>
  <span><img src="${src}" width="64" height="64">64px</span>
  <span><img src="${src}" width="96" height="96">96px</span>
</body></html>`;

  await page.setContent(html);
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(__dirname, '../capture/logo-preview.png') });
  await browser.close();
  console.log('Done.');
})();
