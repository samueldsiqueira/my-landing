// Capturas de QA visual das cenas.
//
//   node scripts/qa/capture.mjs --scenes inicio,about --vp desk,mob --out /tmp/qa
//   node scripts/qa/capture.mjs --scenes inicio --vp desk --frames 0,3,7,12,20,33 --out /tmp/qa
//   node scripts/qa/capture.mjs --scenes about --from inicio --frames 0,1,2,3,5,8 --out /tmp/qa
//   node scripts/qa/capture.mjs --mode read --vp desk,mob --out /tmp/qa     (página inteira)
//   node scripts/qa/capture.mjs --motion reduced --scenes skills --out /tmp/qa
//
// --frames congela as animações no quadro N (12 fps) após o início de cada uma, via ?qa=1.
// --from X: abre a cena X e navega até a cena pedida; os quadros contam a partir da chegada.
import { mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const args = Object.fromEntries(
  process.argv.slice(2).reduce((pairs, arg, i, all) => {
    if (arg.startsWith('--'))
      pairs.push([arg.slice(2), all[i + 1]?.startsWith('--') ? 'true' : (all[i + 1] ?? 'true')]);
    return pairs;
  }, []),
);

const VIEWPORTS = {
  wide: { width: 1920, height: 1080 },
  desk: { width: 1440, height: 900 },
  laptop: { width: 1280, height: 720 },
  tabletL: { width: 1024, height: 768 },
  tabletP: { width: 768, height: 1024, mobile: true },
  mob: { width: 390, height: 844, mobile: true },
  mobL: { width: 844, height: 390, mobile: true },
  small: { width: 360, height: 640, mobile: true },
};

const base = args.base ?? 'http://localhost:3000';
const out = args.out ?? 'qa-shots';
const scenes = (args.scenes ?? 'inicio,about,skills,projects,experience,contact').split(',');
const vps = (args.vp ?? 'desk,mob').split(',');
const frames = args.frames ? args.frames.split(',').map(Number) : null;
const reduced = args.motion === 'reduced';
const read = args.mode === 'read';
const FRAME = 1000 / 12;

await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const errors = [];

for (const vpName of vps) {
  const vp = VIEWPORTS[vpName];
  if (!vp) throw new Error(`viewport desconhecido: ${vpName}`);
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    isMobile: !!vp.mobile,
    hasTouch: !!vp.mobile,
    deviceScaleFactor: vp.mobile ? 2 : 1,
    reducedMotion: reduced ? 'reduce' : 'no-preference',
  });
  const page = await context.newPage();
  page.on('console', (msg) => msg.type() === 'error' && errors.push(`[${vpName}] ${msg.text()}`));
  page.on('pageerror', (err) => errors.push(`[${vpName}] pageerror: ${err.message}`));

  const query = `?qa=1${read ? '&modo=leitura' : ''}`;

  if (read) {
    await page.goto(`${base}/${query}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    // content-visibility: auto não renderiza as seções fora da tela, nem na captura inteira.
    await page.addStyleTag({ content: '.scene { content-visibility: visible !important; }' });
    await page.screenshot({ path: `${out}/read-${vpName}.png`, fullPage: true });
    await context.close();
    continue;
  }

  for (const scene of scenes) {
    const start = args.from ?? scene;
    await page.goto(`${base}/${query}#${start}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => window.__stage, null, { timeout: 10000 });

    if (args.from) {
      await page.evaluate(() => window.__stage.finish());
      await page.waitForTimeout(300);
      await page.evaluate((target) => window.__stage.go(target), scene);
      await page.waitForFunction((target) => document.documentElement.dataset.scene === target, scene, {
        timeout: 5000,
      });
    }

    const tag = args.from ? `${args.from}-to-${scene}` : scene;
    if (frames) {
      for (const f of frames) {
        await page.evaluate((ms) => window.__stage.seek(ms), f * FRAME + 1);
        await page.screenshot({ path: `${out}/${tag}-${vpName}-f${String(f).padStart(2, '0')}.png` });
      }
      await page.evaluate(() => window.__stage.play());
    } else {
      await page.waitForFunction(() => window.__stage.phase() === 'idle', null, { timeout: 8000 }).catch(() => {});
      await page.waitForTimeout(250);
      await page.screenshot({ path: `${out}/${tag}-${vpName}${reduced ? '-reduced' : ''}.png` });
    }
  }
  await context.close();
}

await browser.close();
if (errors.length) {
  console.log('Erros no console:');
  for (const error of [...new Set(errors)]) console.log('  ' + error);
}
console.log(`capturas em ${out}`);
