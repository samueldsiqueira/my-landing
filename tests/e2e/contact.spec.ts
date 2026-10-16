import { expect, test } from '@playwright/test';
import { person } from '../../src/content/profile';
import { openStage, settle } from './helpers';

test.describe('contato', () => {
  test.use({ permissions: ['clipboard-read', 'clipboard-write'] });

  test('copiar e-mail confirma com a etiqueta e anuncia', async ({ page }) => {
    await openStage(page, '#contact');
    await settle(page);
    await page.getByRole('button', { name: 'Copiar e-mail' }).click();
    await expect(page.locator('#contact [role="status"]')).toHaveText('E-mail copiado.');
    await expect(page.locator('#contact').getByText('E-mail copiado', { exact: true })).toBeVisible();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(person.email);
  });

  test('os quatro bilhetes são links com nome claro', async ({ page }) => {
    await openStage(page, '#contact');
    await settle(page);
    const contact = page.locator('#contact');
    await expect(contact.getByRole('link', { name: /Chamar no WhatsApp/ })).toHaveAttribute('href', person.whatsapp.href);
    await expect(contact.getByRole('link', { name: /Enviar e-mail/ })).toHaveAttribute('href', `mailto:${person.email}`);
    await expect(contact.getByRole('link', { name: /LinkedIn/ })).toHaveAttribute('href', person.linkedin);
    await expect(contact.getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', person.github);
  });
});
