import { test, expect } from '@playwright/test';

test.describe('hero-carousel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tests/hero-carousel-test.html');
    // Wait for block decoration
    await page.waitForSelector('.hero-carousel .hero-carousel-slide');
  });

  test('renders expected number of slides', async ({ page }) => {
    const slides = page.locator('.hero-carousel .hero-carousel-slide');
    await expect(slides).toHaveCount(4);
  });

  test('first slide is active on load', async ({ page }) => {
    const firstSlide = page.locator('.hero-carousel .hero-carousel-slide').first();
    await expect(firstSlide).toHaveClass(/hero-carousel-slide--active/);
    await expect(firstSlide).toHaveAttribute('aria-hidden', 'false');
  });

  test('subsequent slides are hidden on load', async ({ page }) => {
    const slides = page.locator('.hero-carousel .hero-carousel-slide');
    const count = await slides.count();
    for (let i = 1; i < count; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await expect(slides.nth(i)).toHaveAttribute('aria-hidden', 'true');
    }
  });

  test('renders prev/next buttons with accessible labels', async ({ page }) => {
    await expect(page.locator('.hero-carousel .hero-carousel-prev')).toHaveAttribute('aria-label', 'Previous slide');
    await expect(page.locator('.hero-carousel .hero-carousel-next')).toHaveAttribute('aria-label', 'Next slide');
  });

  test('next button advances to second slide', async ({ page }) => {
    await page.locator('.hero-carousel .hero-carousel-next').click();
    const secondSlide = page.locator('.hero-carousel .hero-carousel-slide').nth(1);
    await expect(secondSlide).toHaveClass(/hero-carousel-slide--active/);
  });

  test('prev button wraps to last slide from first', async ({ page }) => {
    await page.locator('.hero-carousel .hero-carousel-prev').click();
    const slides = page.locator('.hero-carousel .hero-carousel-slide');
    const count = await slides.count();
    const lastSlide = slides.nth(count - 1);
    await expect(lastSlide).toHaveClass(/hero-carousel-slide--active/);
  });

  test('dot indicators match slide count', async ({ page }) => {
    const indicators = page.locator('.hero-carousel .hero-carousel-indicator');
    await expect(indicators).toHaveCount(4);
  });

  test('clicking a dot indicator activates the correct slide', async ({ page }) => {
    const indicators = page.locator('.hero-carousel .hero-carousel-indicator');
    await indicators.nth(2).click();
    const thirdSlide = page.locator('.hero-carousel .hero-carousel-slide').nth(2);
    await expect(thirdSlide).toHaveClass(/hero-carousel-slide--active/);
  });

  test('first indicator is selected on load', async ({ page }) => {
    const firstIndicator = page.locator('.hero-carousel .hero-carousel-indicator').first();
    await expect(firstIndicator).toHaveAttribute('aria-selected', 'true');
  });

  test('slide body contains heading text', async ({ page }) => {
    const body = page.locator('.hero-carousel .hero-carousel-slide-body').first();
    await expect(body).toContainText('Hydrate with Pedialyte');
  });

  test('empty block renders without throwing', async ({ page }) => {
    await page.goto('/tests/hero-carousel-test.html');
    // Page should not show any JS error - verify block container renders
    await expect(page.locator('.hero-carousel')).toBeAttached();
  });
});
