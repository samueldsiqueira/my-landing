import { expect, test } from '@playwright/test';
import { person } from '../../src/content/profile';
import { openStage, settle } from './helpers';

test.describe('próxima missão (contato)', () => {
  test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

  test('copiar e-mail avisa na tela e para leitores de tela', async ({ page }) => {
    await openStage(page, '#contato');
    await settle(page);
    await page.getByRole('button', { name: 'Copiar e-mail' }).click();
    await expect(page.locator('#contato [role="status"]')).toHaveText('E-mail copiado.');
    await expect(page.locator('#contato').getByText('E-mail copiado!')).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(person.email);
  });

  test('os quatro pergaminhos são links com nome claro', async ({ page }) => {
    await openStage(page, '#contato');
    await settle(page);
    const finale = page.locator('#contato');
    await expect(finale.getByRole('link', { name: /Chamar no WhatsApp/ })).toHaveAttribute('href', person.whatsapp.href);
    await expect(finale.getByRole('link', { name: /Enviar e-mail/ })).toHaveAttribute('href', `mailto:${person.email}`);
    await expect(finale.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute('href', person.linkedin);
    await expect(finale.getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', person.github);
  });
});
