// High-DPR screenshot capture for README. Run with:
//   1. npm run dev          (in a separate terminal)
//   2. node scripts/capture.mjs
//
// Uses puppeteer-core + the locally installed Microsoft Edge (no extra
// browser download). Each shot is taken at deviceScaleFactor: 2 so the
// resulting PNG looks crisp on Retina-class displays.

import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer-core";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "screenshots");
const BASE = process.env.CAPTURE_BASE_URL ?? "http://localhost:5173";

const EDGE_PATHS = [
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
];

function findBrowser() {
  const env = process.env.PUPPETEER_EXECUTABLE_PATH;
  if (env && existsSync(env)) return env;
  for (const p of EDGE_PATHS) if (existsSync(p)) return p;
  throw new Error(
    "No Chromium-based browser found. Set PUPPETEER_EXECUTABLE_PATH.",
  );
}

const VIEWPORT = { width: 1440, height: 900, deviceScaleFactor: 2 };

/** @type {{name: string, path: string, prep?: (page: import("puppeteer-core").Page) => Promise<void>, fullPage?: boolean, height?: number}[]} */
const SHOTS = [
  {
    name: "01-list.png",
    path: "/",
    height: 900,
  },
  {
    name: "02-entry-normalfordeling.png",
    path: "/entry/normalfordeling",
    height: 900,
  },
  {
    name: "04-entry-forventningsverdi.png",
    path: "/entry/forventningsverdi-oversikt",
    height: 900,
  },
  {
    name: "05-table-z.png",
    path: "/table/E3-z-tabell",
    height: 900,
  },
  {
    name: "08-veiviser.png",
    path: "/veiviser",
    height: 900,
  },
  {
    name: "09-veiviser-anbefaling.png",
    path: "/veiviser",
    height: 900,
    async prep(page) {
      // Click through to: Tilfeldig variabel → Kontinuerlig → Normalfordeling
      // antatt → Konfidensintervall for μ – σ ukjent
      await clickByText(page, "Tilfeldig variabel");
      await clickByText(page, "Kontinuerlig");
      await clickByText(page, "Normalfordeling antatt");
      await clickByText(page, "Konfidensintervall for μ – σ ukjent");
      await page.waitForFunction(
        () => document.body.textContent?.includes("Anbefalt"),
        { timeout: 4000 },
      );
    },
  },
  {
    name: "10-hjelp.png",
    path: "/hjelp",
    height: 900,
  },
];

async function clickByText(page, text) {
  const handle = await page.evaluateHandle((needle) => {
    const nodes = Array.from(document.querySelectorAll("button, a, [role=button]"));
    return nodes.find((n) => (n.textContent ?? "").includes(needle)) ?? null;
  }, text);
  const element = handle.asElement();
  if (!element) throw new Error(`Could not find clickable: "${text}"`);
  await element.click();
  await new Promise((r) => setTimeout(r, 250));
}

async function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: findBrowser(),
    headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--font-render-hinting=none"],
    defaultViewport: VIEWPORT,
  });

  try {
    for (const shot of SHOTS) {
      const page = await browser.newPage();
      await page.setViewport({ ...VIEWPORT, height: shot.height ?? VIEWPORT.height });
      const url = `${BASE}${shot.path}`;
      console.log(`→ ${shot.name}  ${url}`);
      await page.goto(url, { waitUntil: "networkidle0", timeout: 15000 });
      // Wait for fonts + KaTeX to settle so glyphs land sharp.
      await page.evaluate(() => document.fonts?.ready);
      if (shot.prep) await shot.prep(page);
      await new Promise((r) => setTimeout(r, 350));
      const outPath = join(OUT_DIR, shot.name);
      await page.screenshot({
        path: outPath,
        fullPage: shot.fullPage ?? false,
        type: "png",
        omitBackground: false,
      });
      await page.close();
    }
  } finally {
    await browser.close();
  }
  console.log(`\nDone. Wrote ${SHOTS.length} screenshots to ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
