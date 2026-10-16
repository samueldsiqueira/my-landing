import { expect, test } from '@playwright/test';
import { currentScene, htmlData, openStage, sceneIds, settle, waitScene } from './helpers';

test.describe('navegação por cenas (desktop)', () => {
  test.skip(({ isMobile }) => isMobile, 'fluxo de teclado e roda');

  test('setas trocam de cena, movem o foco, a URL e o anúncio', async ({ page }) => {
    await openStage(page);
    await settle(page);
    expect(await currentScene(page)).toBe('inicio');

    await page.keyboard.press('ArrowDown');
    await waitScene(page, 'about');
    await expect(page.locator('#about-title')).toBeFocused();
    await expect(page).toHaveURL(/#about$/);
    await expect(page.locator('#stage-live')).toHaveText('Sobre, cena 2 de 6');
    await expect(page.locator('nav[aria-label="Cenas"] [aria-current="location"]')).toContainText('Sobre');

    await settle(page);
    await page.keyboard.press('ArrowUp');
    await waitScene(page, 'inicio');
    await expect(page).toHaveURL(/\/\?qa=1$/);
  });

  test('um gesto de trackpad (com inércia) avança exatamente uma cena', async ({ page }) => {
    await openStage(page);
    await settle(page);
    for (let i = 0; i < 40; i++) {
      await page.mouse.wheel(0, i < 10 ? 30 : 8);
      await page.waitForTimeout(16);
    }
    await page.waitForTimeout(1200);
    expect(await currentScene(page)).toBe('about');
  });

  test('Home, End, números e índice', async ({ page }) => {
    await openStage(page);
    await settle(page);
    await page.keyboard.press('End');
    await waitScene(page, 'contact');
    await settle(page);
    await page.keyboard.press('Home');
    await waitScene(page, 'inicio');
    await settle(page);
    await page.keyboard.press('4');
    await waitScene(page, 'projects');
    await settle(page);
    await page.locator('nav[aria-label="Cenas"] a', { hasText: 'Experiência' }).click();
    await waitScene(page, 'experience');
    await settle(page);
    await page.getByRole('button', { name: /Próxima cena: Contato/ }).click();
    await waitScene(page, 'contact');
  });

  test('links profundos, aliases em português e hashchange', async ({ page }) => {
    await openStage(page, '#experience');
    expect(await currentScene(page)).toBe('experience');
    await page.goto('/?qa=1#contato');
    await page.reload();
    await page.waitForFunction(() => !document.documentElement.dataset.boot);
    expect(await currentScene(page)).toBe('contact');
    await settle(page);
    await page.evaluate(() => (location.hash = 'sobre'));
    await waitScene(page, 'about');
  });

  test('Tab nunca alcança elementos de cenas ocultas', async ({ page }) => {
    await openStage(page);
    await settle(page);
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab');
      const where = await page.evaluate(() => {
        const el = document.activeElement;
        const scene = el?.closest('.scene');
        return { scene: scene?.id ?? null, active: document.documentElement.dataset.scene };
      });
      if (where.scene) expect(where.scene).toBe(where.active);
    }
  });

  test('cada cena tem título focável e só a cena ativa fica visível', async ({ page }) => {
    await openStage(page);
    for (const id of sceneIds) {
      await page.evaluate((target) => window.__stage!.go(target), id);
      await waitScene(page, id);
      await settle(page);
      await expect(page.locator(`#${id}-title`)).toHaveAttribute('tabindex', '-1');
      const visible = await page.$$eval('.scene', (els) =>
        els.filter((el) => getComputedStyle(el).visibility === 'visible').map((el) => el.id),
      );
      expect(visible).toEqual([id]);
    }
  });
});

test.describe('navegação por cenas (mobile)', () => {
  test.skip(({ isMobile }) => !isMobile, 'gestos e barra inferior');

  test('deslizar para cima avança; barra e índice navegam', async ({ page }) => {
    await openStage(page);
    await settle(page);
    const swipe = async (fromY: number, toY: number) => {
      await page.evaluate(
        ([a, b]) => {
          const target = document.elementFromPoint(window.innerWidth / 2, a) ?? document.body;
          const touch = (y: number) => new Touch({ identifier: 1, target, clientX: window.innerWidth / 2, clientY: y });
          target.dispatchEvent(
            new TouchEvent('touchstart', { bubbles: true, touches: [touch(a)], changedTouches: [touch(a)] }),
          );
          target.dispatchEvent(new TouchEvent('touchend', { bubbles: true, touches: [], changedTouches: [touch(b)] }));
        },
        [fromY, toY],
      );
    };
    await swipe(600, 300);
    await waitScene(page, 'about');
    await settle(page);

    await page.getByRole('button', { name: /Próxima cena: Tecnologias/ }).click();
    await waitScene(page, 'skills');
    await settle(page);
    await page.getByRole('button', { name: 'Cena anterior' }).click();
    await waitScene(page, 'about');
    await settle(page);

    await page.getByRole('button', { name: /Sobre/ }).filter({ hasText: 'de 6' }).click();
    const dialog = page.getByRole('dialog', { name: 'Índice' });
    await expect(dialog).toBeVisible();
    await dialog.getByRole('link', { name: /Contato/ }).click();
    await waitScene(page, 'contact');
    await expect(dialog).toBeHidden();
  });

  test('a interface móvel não depende do índice lateral', async ({ page }) => {
    await openStage(page);
    await expect(page.locator('nav[aria-label="Cenas"]')).toBeHidden();
    await expect(page.locator('nav[aria-label="Navegação entre cenas"]')).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    expect((await htmlData(page)).mode).toBe('stage');
  });
});
