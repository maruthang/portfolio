import { test, expect } from '@playwright/test';

test('home page renders all major sections', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Maruthan');
  await expect(page.getByRole('heading', { name: /a few things about me/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /what i build with/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /selected projects/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /open source contributions/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /let's talk/i })).toBeVisible();
});

test('theme toggle flips html class', async ({ page }) => {
  await page.goto('/');
  const toggle = page.getByRole('button', { name: /toggle theme/i });
  await toggle.click();
  const htmlClass = await page.locator('html').getAttribute('class');
  expect(htmlClass).toMatch(/dark|light/);
});

test('contact form shows validation error on short message', async ({ page }) => {
  await page.goto('/#contact');
  await page.getByLabel(/name/i).fill('Jane');
  await page.getByLabel(/email/i).fill('jane@example.com');
  await page.getByLabel(/message/i).fill('short');
  await page.getByRole('button', { name: /send message/i }).click();
  await expect(page.getByText(/at least 10 characters/i)).toBeVisible();
});

test('contact form fallback shows mailto link without RESEND_API_KEY', async ({ page }) => {
  await page.goto('/#contact');
  await page.getByLabel(/name/i).fill('Jane');
  await page.getByLabel(/email/i).fill('jane@example.com');
  await page.getByLabel(/message/i).fill('A perfectly fine length message body.');
  await page.getByRole('button', { name: /send message/i }).click();
  await expect(page.getByRole('link', { name: /open email client/i })).toBeVisible();
});
