import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { openStage, sceneIds, settle, waitScene } from './helpers';

type Violations = Awaited<ReturnType<AxeBuilder['analyze']>>['violations'];

const serious = (violations: Violations) =>
  violations.filter((violation) => violation.impact === 'serious' || violation.impact === 'critical');

for (const id of sceneIds) {
  test(`axe: cena ${id} sem violações sérias`, async ({ page }) => {
    await openStage(page, `#${id}`);
    await waitScene(page, id);
    await settle(page);
    const results = await new AxeBuilder({ page }).exclude('.scene:not(#' + id + ')').analyze();
    const found = serious(results.violations);
    expect(found.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`)).toEqual([]);
  });
}

test('axe: modo leitura sem violações sérias', async ({ page }) => {
  await page.goto('/?modo=leitura');
  const results = await new AxeBuilder({ page }).analyze();
  const found = serious(results.violations);
  expect(found.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`)).toEqual([]);
});
