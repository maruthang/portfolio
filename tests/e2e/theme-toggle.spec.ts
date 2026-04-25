import { test, expect } from '@playwright/test';

test('home page renders and theme toggle flips the html class', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Maruthan');

  const toggle = page.getByRole('button', { name: /toggle theme/i });
  await toggle.click();

  const htmlClass = await page.locator('html').getAttribute('class');
  expect(htmlClass).toMatch(/dark|light/);
});
