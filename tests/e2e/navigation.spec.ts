import { expect, test } from '@playwright/test';
import { currentScene, htmlData, openStage, sceneIds, settle, waitScene } from './helpers';

test.describe('jornada (desktop)', () => {
  test.skip(({ isMobile }) => isMobile, 'fluxo de teclado e roda');

  test('setas avançam no caminho, movem o foco, a URL e o anúncio', async ({ page }) => {
    await openStage(page);
    await settle(page);
    expect(await currentScene(page)).toBe('inicio');

    await page.keyboard.press('ArrowRight');
    await waitScene(page, 'origem');
    await expect(page.locator('#origem-title')).toBeFocused();
    await expect(page).toHaveURL(/#origem$/);
    await expect(page.locator('#stage-live')).toHaveText('Origem, etapa 2 de 10');
    await expect(page.locator('nav[aria-label="Mapa da jornada"] [aria-current="step"]')).toContainText('Origem');

    await settle(page);
    await page.keyboard.press('ArrowDown');
    await waitScene(page, 'indra');
    await settle(page);
    await page.keyboard.press('ArrowLeft');
    await waitScene(page, 'origem');
    await settle(page);
    await page.keyboard.press('ArrowUp');
    await waitScene(page, 'inicio');
    await expect(page).toHaveURL(/\/\?qa=1$/);
  });

  test('um gesto de trackpad (com inércia) avança exatamente uma etapa', async ({ page }) => {
    await openStage(page);
    await settle(page);
    // Disparado de dentro da página a cada ~16 ms, como um trackpad: o espaçamento entre eventos
    // não depende da latência do protocolo de automação.
    await page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          let i = 0;
          const target = document.elementFromPoint(window.innerWidth * 0.2, window.innerHeight / 2) ?? document.body;
          const tick = () => {
            target.dispatchEvent(new WheelEvent('wheel', { deltaY: i < 10 ? 30 : 8, bubbles: true }));
            if (++i < 40) setTimeout(tick, 16);
            else resolve();
          };
          tick();
        }),
    );
    await page.waitForTimeout(1200);
    expect(await currentScene(page)).toBe('origem');
  });

  test('Home, End, números, mapa e botões', async ({ page }) => {
    await openStage(page);
    await settle(page);
    await page.keyboard.press('End');
    await waitScene(page, 'contato');
    await settle(page);
    await page.keyboard.press('Home');
    await waitScene(page, 'inicio');
    await settle(page);
    await page.keyboard.press('4');
    await waitScene(page, 'faculdade');
    await settle(page);
    await page.keyboard.press('7');
    await waitScene(page, 'educacao');
    await settle(page);
    await page.keyboard.press('0');
    await waitScene(page, 'contato');
    await settle(page);
    await page.locator('nav[aria-label="Mapa da jornada"] a', { hasText: 'Grimório' }).click();
    await waitScene(page, 'grimorio');
    await settle(page);
    await page.getByRole('button', { name: /Avançar para Missões secundárias/ }).click();
    await waitScene(page, 'projetos');
    await settle(page);
    await page.getByRole('button', { name: 'Voltar uma etapa' }).first().click();
    await waitScene(page, 'grimorio');
  });

  test('começar a jornada e recomeçar pelos links do conteúdo', async ({ page }) => {
    await openStage(page);
    await settle(page);
    await page.getByRole('link', { name: /Começar jornada/ }).click();
    await waitScene(page, 'origem');
    await settle(page);
    await page.evaluate(() => window.__stage!.go('contato'));
    await waitScene(page, 'contato');
    await settle(page);
    await page.getByRole('link', { name: /Recomeçar a jornada/ }).click();
    await waitScene(page, 'inicio');
  });

  test('links profundos, aliases antigos e em português e hashchange', async ({ page }) => {
    await openStage(page, '#senai');
    expect(await currentScene(page)).toBe('senai');
    await page.goto('/?qa=1#contact');
    await page.reload();
    await page.waitForFunction(() => !document.documentElement.dataset.boot);
    expect(await currentScene(page)).toBe('contato');
    await settle(page);
    await page.evaluate(() => (location.hash = 'tecnologias'));
    await waitScene(page, 'grimorio');
  });

  test('a caminhada marca a viagem e conclui a missão', async ({ page }) => {
    await openStage(page);
    await settle(page);
    await page.keyboard.press('ArrowRight');
    await waitScene(page, 'origem');
    expect((await htmlData(page)).travel).toBe('fwd');
    await page.waitForFunction(() => window.__stage!.phase() === 'idle', null, { timeout: 8000 });
    expect((await htmlData(page)).travel).toBeUndefined();
    await page.keyboard.press('ArrowRight');
    await waitScene(page, 'indra');
    expect((await htmlData(page)).seen).toContain('origem');
  });

  test('saltos de 2+ etapas teleportam; a etapa vizinha continua caminhando', async ({ page }) => {
    await openStage(page);
    await settle(page);
    await page.keyboard.press('End');
    await waitScene(page, 'contato');
    expect((await htmlData(page)).travel).toBe('warp');
    await page.waitForFunction(() => window.__stage!.phase() === 'idle', null, { timeout: 8000 });
    expect((await htmlData(page)).travel).toBeUndefined();
    await page.keyboard.press('ArrowLeft');
    await waitScene(page, 'projetos');
    expect((await htmlData(page)).travel).toBe('back');
    await settle(page);
    await page.locator('nav[aria-label="Mapa da jornada"] a', { hasText: 'Início' }).click();
    await waitScene(page, 'inicio');
    expect((await htmlData(page)).travel).toBe('warp');
  });

  test('Tab nunca alcança elementos de etapas ocultas', async ({ page }) => {
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

  test('cada etapa tem título focável e só a etapa ativa fica visível', async ({ page }) => {
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

test.describe('jornada (celular)', () => {
  test.skip(({ isMobile }) => !isMobile, 'gestos e barra inferior');

  test('deslizar avança; barra e mapa navegam', async ({ page }) => {
    await openStage(page);
    await settle(page);
    const swipe = async (from: [number, number], to: [number, number]) => {
      await page.evaluate(
        ([a, b]) => {
          const target = document.elementFromPoint(a[0], a[1]) ?? document.body;
          const touch = (p: number[]) => new Touch({ identifier: 1, target, clientX: p[0], clientY: p[1] });
          target.dispatchEvent(new TouchEvent('touchstart', { bubbles: true, touches: [touch(a)], changedTouches: [touch(a)] }));
          target.dispatchEvent(new TouchEvent('touchend', { bubbles: true, touches: [], changedTouches: [touch(b)] }));
        },
        [from, to],
      );
    };
    // deslizar para a esquerda, sobre o cenário: o herói segue em frente
    await swipe([320, 200], [80, 210]);
    await waitScene(page, 'origem');
    await settle(page);

    await page.getByRole('button', { name: /Avançar para Guilda do Suporte/ }).click();
    await waitScene(page, 'indra');
    await settle(page);
    await page.getByRole('button', { name: 'Voltar uma etapa' }).last().click();
    await waitScene(page, 'origem');
    await settle(page);

    await page.getByRole('button', { name: /Origem/ }).filter({ hasText: 'de 10' }).click();
    const dialog = page.getByRole('dialog', { name: 'Mapa da jornada' });
    await expect(dialog).toBeVisible();
    await dialog.getByRole('link', { name: /Próxima missão/ }).click();
    await waitScene(page, 'contato');
    await expect(dialog).toBeHidden();
  });

  test('a interface do celular não depende do mapa de desktop', async ({ page }) => {
    await openStage(page);
    await expect(page.locator('nav[aria-label="Mapa da jornada"]')).toBeHidden();
    await expect(page.locator('nav[aria-label="Navegação da jornada"]')).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    expect((await htmlData(page)).mode).toBe('stage');
  });
});
