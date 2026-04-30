import { test, expect } from '@playwright/test';

test('/projects index lists all 6 projects', async ({ page }) => {
  await page.goto('/projects');
  await expect(page.getByRole('heading', { name: /everything i.{0,3}ve shipped/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /B2B Multi-Vendor Marketplace/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Conversational Commerce Bot/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Enterprise Data Warehouse/i })).toBeVisible();
});

test('/projects/[slug] renders case study with breadcrumbs and prev/next', async ({ page }) => {
  await page.goto('/projects/b2b-marketplace');
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'B2B Multi-Vendor Marketplace',
  );
  await expect(page.getByRole('heading', { name: /^context$/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /^my role$/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /^architecture$/i })).toBeVisible();
  await expect(page.getByRole('navigation', { name: /breadcrumb/i })).toBeVisible();
  await expect(page.getByRole('navigation', { name: /project navigation/i })).toBeVisible();
});

test('/projects/[unknown-slug] returns 404', async ({ page }) => {
  const response = await page.goto('/projects/this-does-not-exist-xyz');
  expect(response?.status()).toBe(404);
});
