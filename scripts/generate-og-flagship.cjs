const { chromium } = require('../node_modules/playwright');
const path = require('path');

const TEMPLATE = path.join(__dirname, 'og-flagship-template.html');
const OUT_PATH = path.join(__dirname, '../public/og/og-image.png');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1200, height: 630 });

  const templateUrl = 'file:///' + TEMPLATE.replace(/\\/g, '/');
  await page.goto(templateUrl);
  await page.waitForLoadState('networkidle');

  await page.screenshot({ path: OUT_PATH, type: 'png' });
  await browser.close();
  console.log('✓ og-image.png (flagship) saved to', OUT_PATH);
})();
