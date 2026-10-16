import { expect, test } from '@playwright/test';
import { about, contact, jobs, person, skillGroups } from '../../src/content/profile';

test.describe('conteúdo no HTML do servidor', () => {
  test('todo o conteúdo e os links chegam sem JavaScript', async ({ request }) => {
    const html = await (await request.get('/')).text();
    const text = html
      .replace(/<[^>]+>/g, ' ')
      .replace(/&#x27;|&#39;/g, "'")
      .replace(/&amp;/g, '&');

    for (const value of [
      person.name,
      ...person.roles,
      contact.title,
      contact.lead,
      person.whatsapp.display,
      person.email,
    ]) {
      expect(text, value).toContain(value);
    }
    for (const item of about) {
      expect(text).toContain(item.title);
      expect(text).toContain(item.text);
    }
    for (const group of skillGroups) {
      expect(text).toContain(group.label);
      for (const skill of group.items) expect(text).toContain(skill.name);
    }
    for (const job of jobs) {
      expect(text).toContain(job.company);
      expect(text).toContain(job.title);
      for (const paragraph of job.description) expect(text).toContain(paragraph);
    }
    for (const href of [person.linkedin, person.github, person.whatsapp.href, `mailto:${person.email}`]) {
      expect(html, href).toContain(`href="${href}"`);
    }
  });

  test('metadados, Open Graph e dados estruturados', async ({ request }) => {
    const html = await (await request.get('/')).text();
    expect(html).toContain('<html lang="pt-BR"');
    expect(html).toMatch(/<meta name="description" content="[^"]+"/);
    expect(html).toMatch(/<meta property="og:image" content="[^"]+\/og\.png"/);
    expect(html).toContain('"@type":"Person"');
    expect((await request.get('/og.png')).ok()).toBe(true);
  });

  test('nenhum token ou chamada à API da Vercel no JavaScript público', async ({ page, request }) => {
    const scripts = new Set<string>();
    page.on('response', (response) => {
      if (response.url().includes('/_next/static/') && response.url().endsWith('.js')) scripts.add(response.url());
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(scripts.size).toBeGreaterThan(0);
    for (const url of scripts) {
      const body = await (await request.get(url)).text();
      expect(body, url).not.toContain('api.vercel.com');
      expect(body, url).not.toContain('VERCEL_API_TOKEN');
      expect(body, url).not.toContain('NEXT_PUBLIC_VERCEL_TOKEN');
    }
  });

  test('a foto publicada não carrega metadados EXIF/GPS', async ({ request }) => {
    const bytes = await (await request.get('/img/samuel-halftone.png')).body();
    expect(bytes.includes(Buffer.from('Exif'))).toBe(false);
    expect((await request.get('/profile_picture.jpg')).status()).toBe(404);
  });
});
