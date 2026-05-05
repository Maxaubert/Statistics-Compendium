// Smoketest screenshots for the concept-cleanup branch.
// Captures list views, the relocated overview/method entries, and the
// /concept/:id redirect shim. Run with `node screenshots/capture-cleanup.mjs`
// (assumes `vite` is already serving on http://127.0.0.1:5188).

import puppeteer from "puppeteer-core";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EDGE = String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = __dirname;
const BASE = "http://127.0.0.1:5188";

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function shoot(page, url, file, opts = {}) {
  const { wait = 600, fullPage = false } = opts;
  await page.goto(`${BASE}${url}`, { waitUntil: "networkidle0" });
  await sleep(wait);
  await page.screenshot({ path: path.join(OUT, file), fullPage });
  console.log(`captured ${file} (from ${url})`);
}

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "new",
  defaultViewport: { width: 1280, height: 900 },
  args: ["--hide-scrollbars", "--disable-gpu", "--no-sandbox"],
});

try {
  const page = await browser.newPage();

  // 1. List view — Formler tab (default; should show featured Oversikter section)
  await shoot(page, "/#/?tab=formler", "cleanup-01-list-formler.png", { fullPage: true });

  // 2. List view — Tabeller tab
  await shoot(page, "/#/?tab=tabeller", "cleanup-02-list-tabeller.png", { fullPage: true });

  // 3. Overview entry: varians-oversikt
  await shoot(page, "/#/entry/varians-oversikt", "cleanup-03-entry-varians-oversikt.png", {
    fullPage: true,
  });

  // 4. Method entry: bootstrapping
  await shoot(page, "/#/entry/bootstrapping", "cleanup-04-entry-bootstrapping.png", {
    fullPage: true,
  });

  // 5. Old concept URL — should redirect to /entry/varians-oversikt
  await page.goto(`${BASE}/#/concept/varians`, { waitUntil: "networkidle0" });
  await sleep(800);
  const redirectedTo = await page.evaluate(() => window.location.hash);
  console.log(`/#/concept/varians → ${redirectedTo}`);
  await page.screenshot({
    path: path.join(OUT, "cleanup-05-concept-redirect.png"),
    fullPage: false,
  });

  // 6. Glossary popup for de-morgans-lov — open from /ordliste
  await page.goto(`${BASE}/#/ordliste`, { waitUntil: "networkidle0" });
  await page.waitForFunction(
    () =>
      Array.from(document.querySelectorAll("h1")).some((h) =>
        /Ordliste/i.test(h.textContent ?? ""),
      ),
    { timeout: 15000 },
  );
  await sleep(500);
  // Click the de-morgans-lov card via its aria-label
  const opened = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button")).find((b) =>
      /De Morgans? lov/i.test(b.getAttribute("aria-label") ?? ""),
    );
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  if (!opened) console.warn("de-morgans-lov button not found by aria-label; popup not opened");
  await sleep(700);
  await page.screenshot({
    path: path.join(OUT, "cleanup-06-glossary-popup-de-morgans.png"),
    fullPage: false,
  });
  console.log("captured cleanup-06-glossary-popup-de-morgans.png");
} finally {
  await browser.close();
}
