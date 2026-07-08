// One-off asset for AdSense Privacy & messaging ("Sélectionner des sites" → logo upload).
// Google requires PNG/JPG (no SVG), <=150K, ~600x120 (5:1). Not deployed — kept out of public/
// since it's only ever uploaded once to the AdSense dashboard, not served on our own site.
const { chromium } = require('../node_modules/playwright');
const path = require('path');
const brand = require('./brand-tokens.cjs');

const TEMPLATE = path.join(__dirname, 'adsense-logo-template.html');
const OUT = path.join(__dirname, 'adsense-logo.png');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 600, height: 120 });

  const templateUrl = 'file:///' + TEMPLATE.replace(/\\/g, '/');
  await page.goto(templateUrl);
  await page.waitForLoadState('networkidle');

  await page.evaluate((svg) => {
    document.getElementById('logo-mark').innerHTML = svg;
  }, brand.logoMarkSvg);

  await page.waitForTimeout(80);
  await page.screenshot({ path: OUT, type: 'png', omitBackground: true });
  await browser.close();
  console.log('✓ adsense-logo.png saved to scripts/');
})();
