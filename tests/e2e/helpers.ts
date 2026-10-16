import type { Page } from '@playwright/test';

export const sceneIds = ['inicio', 'about', 'skills', 'projects', 'experience', 'contact'] as const;

export const htmlData = (page: Page) =>
  page.evaluate(() => ({ ...document.documentElement.dataset }) as Record<string, string | undefined>);

export const currentScene = async (page: Page) => (await htmlData(page)).scene;

/** Abre a página no modo cenas e espera o React hidratar (o Director remove data-boot). */
export async function openStage(page: Page, hash = '') {
  await page.goto(`/?qa=1${hash}`);
  await page.waitForFunction(() => !document.documentElement.dataset.boot && window.__stage);
}

/** Pula a coreografia de entrada em curso e espera a máquina ficar ociosa. */
export async function settle(page: Page) {
  await page.evaluate(() => window.__stage!.finish());
  await page.waitForFunction(() => window.__stage!.phase() === 'idle', null, { timeout: 5000 });
}

export async function waitScene(page: Page, id: string) {
  await page.waitForFunction((target) => document.documentElement.dataset.scene === target, id, { timeout: 5000 });
  await page.waitForFunction(() => window.__stage!.phase() !== 'exiting', null, { timeout: 5000 });
}
