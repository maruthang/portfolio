import { test, expect } from '@playwright/test';

test('/oss page renders stats, project list, and PR table', async ({ page }) => {
  await page.goto('/oss');
  await expect(page.getByRole('heading', { name: /every contribution/i })).toBeVisible();
  await expect(page.getByText(/merged prs/i).first()).toBeVisible();
  await expect(page.getByPlaceholder(/search prs/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /^merged$/i })).toBeVisible();
});

test('OSS table filter by status: Open hides merged PRs', async ({ page }) => {
  await page.goto('/oss');
  await page.getByRole('button', { name: /^open$/i }).click();
  // An open PR title fragment that exists in ossAllPrs
  await expect(page.getByText(/collapse repeated tool invocations/i)).toBeVisible();
  // A merged PR title that should NOT be visible after filter
  await expect(page.getByText(/skip auto-generated response decorator/i)).not.toBeVisible();
});

test('OSS table search narrows results', async ({ page }) => {
  await page.goto('/oss');
  await page.getByPlaceholder(/search prs/i).fill('heredoc');
  await expect(page.getByText(/heredoc.*terminal/i)).toBeVisible();
});
