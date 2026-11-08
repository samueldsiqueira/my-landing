// Gera public/og.png (1200×630): uma captura da tela de título do próprio jogo.
// Requer o site rodando (npm run build && npx next start -p 3000).
//   node scripts/og/render.mjs [http://localhost:3000]
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const base = process.argv[2] ?? 'http://localhost:3000';
const out = fileURLToPath(new URL('../../public/og.png', import.meta.url));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, reducedMotion: 'reduce' });
await page.goto(`${base}/?qa=1`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
// Sem os comandos: a imagem de compartilhamento é o cenário, o herói e a janela de título.
await page.addStyleTag({ content: '.g-tools, .g-map, .g-steps, .g-bar, .g-hint, .skip-link { display: none !important; }' });
await page.waitForTimeout(300);
await page.screenshot({ path: out });
await browser.close();
console.log(`gerado ${out}`);
