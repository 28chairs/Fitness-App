import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Fitness Community Platform/);
  });

  test('should navigate to register page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Get Started');
    await expect(page).toHaveURL(/.*register/);
  });

  test('should navigate to communities page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Explore Communities');
    await expect(page).toHaveURL(/.*communities/);
  });
});

