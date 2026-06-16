import { expect, test } from "@playwright/test";

test("home chapter keeps one tab background and flows to products", async ({ page }) => {
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

  await expect(page.getByRole("link", { exact: true, name: "Početna" })).toHaveAttribute(
    "aria-current",
    "page",
  );

  const heroBackground = await page
    .locator('[data-slide-id="hero"]')
    .evaluate((element) => getComputedStyle(element).backgroundImage);

  await page.keyboard.press("ArrowRight");
  await expect(page).toHaveURL(/slide=za-koga-je/);
  await expect(page.getByRole("heading", { name: /Jedan praktičan izbor/ })).toBeVisible();

  const audienceBackground = await page
    .locator('[data-slide-id="za-koga-je"]')
    .evaluate((element) => getComputedStyle(element).backgroundImage);
  expect(audienceBackground).toBe(heroBackground);

  await page.goto("/hr?slide=brzi-put-dalje");
  await expect(page.getByRole("heading", { name: /Odaberite sljedeći korak/ })).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(page).toHaveURL(/\/hr\/proizvodi\?slide=pregled$/);
  await expect(page.getByRole("link", { exact: true, name: "Proizvodi" })).toHaveAttribute(
    "aria-current",
    "page",
  );
});

test("first product slide can move back to the last home slide", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name.includes("mobile"), "Keyboard chapter flow is desktop-only.");

  await page.goto("/hr/proizvodi?slide=pregled");

  await expect(page.locator("#pregled-title")).toBeVisible();

  await page.keyboard.press("ArrowLeft");
  await expect(page).toHaveURL(/\/hr\?slide=brzi-put-dalje$/);
  await expect(page.getByRole("heading", { name: /Odaberite sljedeći korak/ })).toBeVisible();
});

test("products use ZORPro fallback slugs", async ({ page }) => {
  await page.goto("/hr/proizvodi?slide=zorpro-24");

  await expect(page.locator("#zorpro-24-title")).toBeVisible();
  await expect(page.getByRole("link", { name: "Detalji proizvoda" })).toHaveAttribute(
    "href",
    "/hr/proizvodi/zorpro-24",
  );

  await page.goto("/en/products/zorpro-36");
  await expect(page.locator("#zorpro-36-title")).toBeVisible();
  await expect(page).toHaveURL(/\/en\/products\/zorpro-36$/);
});

test("deep-linked home slide hydrates without control mismatch", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  await page.goto("/hr?slide=brzi-put-dalje");
  await expect(page.getByRole("heading", { name: /Odaberite sljedeći korak/ })).toBeVisible();

  expect(consoleErrors.join("\n")).not.toContain("hydrated but some attributes");
});

test("contact stays at the end of the menu flow", async ({ page }) => {
  await page.goto("/hr/kontakt?slide=lokacija");

  await expect(page.locator("#lokacija-title")).toBeVisible();

  const nextButton = page.getByRole("button", { name: "Sljedeći slide" });
  if ((await nextButton.count()) > 0) {
    await expect(nextButton).toBeDisabled();
  }

  const currentUrl = page.url();
  await page.keyboard.press("ArrowRight");
  await expect(page).toHaveURL(currentUrl);
});

test("mobile bottom navigation keeps the active item visible", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/hr/kontakt?slide=whatsapp");

  const mobileNav = page.locator('nav[aria-label="Mobile navigation"]');
  const activeItem = mobileNav.locator('a[aria-current="page"]');

  await expect(activeItem).toContainText("Kontakt");
  await expect(activeItem).toBeVisible();
  await expect(activeItem).toHaveAttribute("href", "/hr/kontakt");
  await expect
    .poll(async () =>
      activeItem.evaluate((node) => {
        const rect = node.getBoundingClientRect();
        const nav = node.closest("nav");
        if (!nav) {
          return false;
        }

        const navRect = nav.getBoundingClientRect();
        return rect.left >= navRect.left && rect.right <= navRect.right;
      }),
    )
    .toBe(true);
});

test("production process slide shows text and image on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/hr/proizvodnja?slide=skladiste");

  await expect(page.locator("#skladiste-title")).toBeVisible();
  await expect(page.getByText("Dogovor ima smisla tek kada je zaliha provjerena.")).toBeVisible();
  await expect(page.getByAltText("Dostupnost iz skladišta skraćuje put do kupca.")).toBeVisible();
  await expect(page.getByRole("heading", { level: 3 })).toHaveCount(0);
});

test("blog article uses an internal reader while the shell stays fixed", async ({ page }) => {
  await page.goto("/hr/blog/kako-planirati-potrosnju-toaletnog-papira?slide=reader");

  await expect(page.getByRole("heading", { name: /Reader panel/ })).toBeVisible();
  await expect(page.locator("[data-deck-scroll]")).toBeVisible();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
});

test("contact form keeps a fallback path when Supabase is not configured", async ({ page }) => {
  await page.goto("/hr/kontakt?slide=forma");

  const form = page.locator("form");
  await form.getByLabel("Ime ili firma").fill("Apartmani Zagreb");
  await form.getByLabel("Email ili telefon").fill("test@example.com");
  await form.getByRole("textbox", { name: "Poruka" }).fill("Trebamo okvirnu ponudu za ZORPro 36.");
  await form.getByRole("button", { name: "Posalji upit" }).click();

  await expect(page.getByRole("status")).toContainText("Supabase nije konfiguriran lokalno");
  await expect(page.getByRole("link", { name: "Otvori email" })).toBeVisible();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
});
