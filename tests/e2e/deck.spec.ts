import { expect, test } from "@playwright/test";

test("home chapter behaves like a no-scroll deck", async ({ page }) => {
  await page.goto("/hr");

  await expect(
    page.getByRole("heading", {
      name: "Toaletni papir iz hrvatske proizvodnje, dostupan kad vam treba.",
    }),
  ).toBeVisible();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");

  const viewport = await page.evaluate(() => ({
    innerHeight: window.innerHeight,
    scrollHeight: document.documentElement.scrollHeight,
  }));
  expect(viewport.scrollHeight).toBeLessThanOrEqual(viewport.innerHeight + 1);

  await page.keyboard.press("ArrowRight");
  await expect(page).toHaveURL(/slide=za-koga-je/);
  await expect(page.getByRole("heading", { name: /Jedan praktičan izbor/ })).toBeVisible();

  await page.getByRole("button", { name: "Sljedeći slide" }).click();
  await expect(page).toHaveURL(/slide=zasto-zor/);
});

test("blog article uses an internal reader while the shell stays fixed", async ({ page }) => {
  await page.goto("/hr/blog/kako-planirati-potrosnju-toaletnog-papira?slide=reader");

  await expect(page.getByRole("heading", { name: /Reader panel/ })).toBeVisible();
  await expect(page.locator("[data-deck-scroll]")).toBeVisible();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
});
