import { expect, test } from "@playwright/test";

test("admin route is protected when Supabase is not configured", async ({ page, request }) => {
  const response = await request.get("/admin", { maxRedirects: 0 });

  expect(response.status()).toBeGreaterThanOrEqual(300);
  expect(response.status()).toBeLessThan(400);
  expect(response.headers().location).toContain("/admin/login");
  await response.dispose();

  await page.goto("/admin/login");
  await expect(page.getByRole("heading", { name: "Admin login" })).toBeVisible();
  await expect(page.getByText("Supabase nije konfiguriran")).toBeVisible();
});
