import { expect, test } from '@playwright/test';
import { htmlData, openStage, sceneIds, settle, waitScene } from './helpers';

test('modo leitura: todas as seções visíveis, página rolável, sem interface de cenas', async ({ page }) => {
  await page.goto('/?modo=leitura');
  expect((await htmlData(page)).mode).toBe('read');
  for (const id of sceneIds) await expect(page.locator(`#${id}`)).toBeVisible();
  const scrollable = await page.evaluate(() => document.documentElement.scrollHeight > window.innerHeight * 3);
  expect(scrollable).toBe(true);
  await expect(page.getByRole('link', { name: 'Ver como cenas' })).toBeVisible();
  const running = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length);
  expect(running).toBe(0);
});

test.describe('sem JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('o documento continua completo e legível', async ({ page }) => {
    await page.goto('/');
    for (const id of sceneIds) await expect(page.locator(`#${id}`)).toBeVisible();
    await expect(page.locator('h1')).toHaveAccessibleName("Samuel D' Siqueira");
  });
});

test.describe('movimento reduzido', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });
  test('preferência do sistema desliga todas as animações e a navegação continua', async ({ page, isMobile }) => {
    await openStage(page);
    expect((await htmlData(page)).motion).toBe('reduced');
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
    if (isMobile) await page.getByRole('button', { name: /Próxima cena/ }).click();
    else await page.keyboard.press('ArrowDown');
    await waitScene(page, 'about');
    expect(await page.evaluate(() => document.getAnimations().length)).toBe(0);
  });
});

test('o botão de movimento reduzido vale para a próxima visita', async ({ page, isMobile }) => {
  test.skip(isMobile, 'o botão fica na folha de índice no mobile');
  await openStage(page);
  await settle(page);
  const toggle = page.getByRole('button', { name: 'Movimento reduzido' }).first();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  expect((await htmlData(page)).motion).toBe('reduced');
  await page.reload();
  expect((await htmlData(page)).motion).toBe('reduced');
  await page.getByRole('button', { name: 'Movimento reduzido' }).first().click();
  expect((await htmlData(page)).motion).toBe('full');
});
