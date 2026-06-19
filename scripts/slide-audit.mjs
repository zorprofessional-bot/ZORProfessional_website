// Vizualni audit slajdova: prolazi kroz svako poglavlje i slajd na desktop i
// mobilnom viewportu, mjeri prelazi li sadržaj aktivnog slajda viewport
// (scrollHeight > clientHeight) i sprema screenshot svakog slajda.
//
// Pokretanje:  node scripts/slide-audit.mjs
// Rezultat:    .audit/<viewport>/<chapter>__<slide>.png  + ispis tablice u konzoli.
//
// Skripta sama digne `next dev` ako već ne radi (kao scripts/run-e2e.mjs).

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { chromium, devices } from "@playwright/test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = process.env.PORT ?? "3000";
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${port}`;
const outDir = path.join(root, ".audit");

const chapters = [
  { key: "home", url: "/hr" },
  { key: "proizvodi", url: "/hr/proizvodi" },
  { key: "proizvodnja", url: "/hr/proizvodnja" },
  { key: "kalkulator", url: "/hr/kalkulator" },
  { key: "blog", url: "/hr/blog" },
  { key: "karijere", url: "/hr/karijere" },
  { key: "kontakt", url: "/hr/kontakt" },
];

const viewports = [
  { name: "desktop", options: { viewport: { width: 1280, height: 800 } } },
  { name: "mobile", options: { ...devices["Pixel 7"] } },
];

let serverProcess = null;

async function isServerReady() {
  try {
    const response = await fetch(`${baseURL}/hr`, { redirect: "follow" });
    return response.status >= 200 && response.status < 500;
  } catch {
    return false;
  }
}

async function waitForServer(timeoutMs = 120_000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (await isServerReady()) return;
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Timed out waiting for ${baseURL}/hr`);
}

function activeSlideMetrics() {
  return () => {
    const frames = Array.from(document.querySelectorAll(".deck-slide-frame"));
    const active = frames.find((frame) => {
      const cs = getComputedStyle(frame);
      return (
        cs.visibility !== "hidden" &&
        Number.parseFloat(cs.opacity) > 0.5 &&
        frame.getBoundingClientRect().width > 0
      );
    });
    if (!active) return null;
    const section = active.querySelector("[data-slide-id]");
    return {
      id: section?.getAttribute("data-slide-id") ?? "?",
      scrollH: active.scrollHeight,
      clientH: active.clientHeight,
      overflow: active.scrollHeight - active.clientHeight,
    };
  };
}

async function auditViewport(browser, viewport, results) {
  const context = await browser.newContext({
    ...viewport.options,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  const dir = path.join(outDir, viewport.name);
  await mkdir(dir, { recursive: true });

  for (const chapter of chapters) {
    await page.goto(`${baseURL}${chapter.url}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(350);

    const seen = new Set();
    for (let step = 0; step < 8; step += 1) {
      await page.waitForTimeout(250);
      const metrics = await page.evaluate(activeSlideMetrics());
      if (!metrics || seen.has(metrics.id)) break;
      seen.add(metrics.id);

      await page.screenshot({
        path: path.join(dir, `${chapter.key}__${metrics.id}.png`),
      });

      results.push({
        viewport: viewport.name,
        chapter: chapter.key,
        slide: metrics.id,
        overflowPx: metrics.overflow,
        overflowing: metrics.overflow > 1,
      });

      const before = page.url();
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(150);
      // Ako smo prešli u drugo poglavlje (promjena pathnamea), stani.
      if (new URL(page.url()).pathname !== new URL(before).pathname) break;
    }
  }

  await context.close();
}

async function main() {
  const hadServer = await isServerReady();
  if (!hadServer) {
    serverProcess = spawn(
      process.execPath,
      ["./node_modules/next/dist/bin/next", "dev", "-p", port],
      { cwd: root, env: process.env, stdio: "ignore", windowsHide: true },
    );
    await waitForServer();
  }

  const browser = await chromium.launch();
  const results = [];
  try {
    for (const viewport of viewports) {
      await auditViewport(browser, viewport, results);
    }
  } finally {
    await browser.close();
    if (!hadServer && serverProcess?.pid) {
      serverProcess.kill("SIGTERM");
    }
  }

  const overflowing = results.filter((r) => r.overflowing);
  console.log("\n=== SLIDE AUDIT ===");
  console.table(
    results.map((r) => ({
      viewport: r.viewport,
      chapter: r.chapter,
      slide: r.slide,
      overflowPx: r.overflowPx,
      fit: r.overflowing ? "OVERFLOW" : "ok",
    })),
  );
  console.log(
    overflowing.length === 0
      ? `\nSvi slajdovi stanu u viewport (${results.length} provjereno). Screenshotovi: .audit/`
      : `\n${overflowing.length}/${results.length} slajdova prelazi viewport:\n` +
          overflowing
            .map((r) => `  - [${r.viewport}] ${r.chapter}/${r.slide} (+${r.overflowPx}px)`)
            .join("\n"),
  );
}

main().catch((error) => {
  console.error(error);
  if (serverProcess?.pid) serverProcess.kill("SIGTERM");
  process.exitCode = 1;
});
