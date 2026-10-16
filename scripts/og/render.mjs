// Gera public/og.png (1200x630) a partir de scripts/og/og.html.
//   node scripts/og/render.mjs
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const html = fileURLToPath(new URL('./og.html', import.meta.url));
const out = fileURLToPath(new URL('../../public/og.png', import.meta.url));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(`file://${html}`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: out });
await browser.close();
console.log(`gerado ${out}`);
