const { chromium } = require('../node_modules/playwright');
const path = require('path');

const TEMPLATE = path.join(__dirname, 'og-template.html');
const OUT_DIR  = path.join(__dirname, '../public/og');

;(async () => {
  const browser  = await chromium.launch();
  const context  = await browser.newContext();
  const page     = await context.newPage();
  await page.setViewportSize({ width: 1200, height: 630 });
  const templateUrl = 'file:///' + TEMPLATE.replace(/\\/g, '/');
  await page.goto(templateUrl);
  await page.waitForLoadState('networkidle');

  await page.evaluate(({ tag, title, subtitle, size }) => {
    document.getElementById('tag').textContent = tag;
    document.getElementById('title').textContent = title;
    document.getElementById('title').style.setProperty('--title-size', size + 'px');
    document.getElementById('subtitle').textContent = subtitle;
  }, { tag: 'Dev Util', title: 'Text Case Converter', subtitle: 'camelCase, PascalCase, snake_case,\nkebab-case and more — instantly.', size: 66 });

  await page.waitForTimeout(200);
  await page.screenshot({ path: path.join(OUT_DIR, 'text-case.png'), type: 'png' });
  await browser.close();
  console.log('Done — text-case.png');
})();
