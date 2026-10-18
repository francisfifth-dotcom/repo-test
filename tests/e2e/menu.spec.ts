import { expect, test } from "@playwright/test";

test("menu is readable on desktop and mobile", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Latte", exact: true })).toBeVisible();
  await expect(page.getByText("$4.50", { exact: true })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("Demo menu");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("menu.png"), fullPage: true });
  expect(errors).toEqual([]);
});

test("missing Supabase configuration has a clear fallback", async ({ page }) => {
  await page.goto("/");
  const loadButton = page.getByRole("button", { name: "Load live menu" });
  await page.keyboard.press("Tab");
  await expect(loadButton).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("status")).toHaveText("Live menu unavailable. Showing the demo menu.");
  await expect(page.getByRole("heading", { name: "Espresso", exact: true })).toBeVisible();
});
