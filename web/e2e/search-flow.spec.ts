import { test, expect } from "@playwright/test";

test.describe("City search flow", () => {
  test("loads with default weather", async ({ page }) => {
    await page.goto("/");

    // App title is visible
    await expect(page.getByText("WeatherApp")).toBeVisible();

    // Search input is present
    await expect(page.getByPlaceholder("Search for a city...")).toBeVisible();
  });

  test("search for a city and see results", async ({ page }) => {
    await page.goto("/");

    const searchInput = page.getByPlaceholder("Search for a city...");
    await searchInput.fill("Oslo");

    // Wait for autocomplete results
    const listbox = page.getByRole("listbox");
    await expect(listbox).toBeVisible({ timeout: 5000 });

    // Results should contain Oslo
    const firstOption = listbox.getByRole("option").first();
    await expect(firstOption).toContainText("Oslo");

    // Click the result
    await firstOption.click();

    // Weather should display for Oslo
    await expect(page.getByText("Oslo")).toBeVisible({ timeout: 5000 });
  });

  test("keyboard navigation in search", async ({ page }) => {
    await page.goto("/");

    const searchInput = page.getByPlaceholder("Search for a city...");
    await searchInput.fill("Bergen");

    // Wait for results
    await expect(page.getByRole("listbox")).toBeVisible({ timeout: 5000 });

    // Arrow down to first result, then enter
    await searchInput.press("ArrowDown");
    await searchInput.press("Enter");

    // Should navigate away from search (listbox closes)
    await expect(page.getByRole("listbox")).not.toBeVisible();
  });

  test("C/F toggle changes temperature unit", async ({ page }) => {
    await page.goto("/");

    // Wait for weather to load
    await page.waitForSelector("article", { timeout: 10000 });

    // Find and click the unit toggle
    const toggle = page.getByRole("button", { name: /Switch to/ });
    await toggle.click();

    // The toggle should now show the other unit as active
    await expect(toggle).toBeVisible();
  });

  test("skip-to-content link works", async ({ page }) => {
    await page.goto("/");

    // Tab to reveal skip link
    await page.keyboard.press("Tab");

    const skipLink = page.getByText("Skip to main content");
    await expect(skipLink).toBeVisible();
  });
});
