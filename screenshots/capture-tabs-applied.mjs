import puppeteer from "puppeteer-core";
import path from "node:path";
import { fileURLToPath } from "node:url";

const EDGE = String.raw`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = __dirname;

const ENTRIES = [
  ["normalfordeling", "normalfordeling-tabs.png"],
  ["binomial-fordeling", "binomial-tabs.png"],
  ["en-utvalg-z-test", "z-test-tabs.png"],
  ["bayes-setning", "bayes-tabs.png"],
];

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: "new",
  defaultViewport: { width: 1280, height: 1400 },
  args: ["--hide-scrollbars", "--disable-gpu", "--no-sandbox"],
});

try {
  for (const [id, file] of ENTRIES) {
    const page = await browser.newPage();
    await page.goto(`http://localhost:5173/#/entry/${id}`, {
      waitUntil: "networkidle0",
    });
    await page.waitForFunction(
      () => document.querySelector('[data-testid="entry-detail"]') !== null,
      { timeout: 15000 },
    );
    await new Promise((r) => setTimeout(r, 600));

    // Crop to the steg-for-steg + detailed-solutions area (skip hero).
    const target = await page.evaluate(() => {
      const headers = Array.from(document.querySelectorAll("h2, h3"));
      const stepHeader = headers.find((h) =>
        /Steg for steg/i.test(h.textContent ?? ""),
      );
      const r = stepHeader?.getBoundingClientRect();
      return r ? { y: window.scrollY + r.top - 24 } : null;
    });
    if (target) await page.evaluate((y) => window.scrollTo(0, y), target.y);
    await new Promise((r) => setTimeout(r, 150));

    await page.screenshot({
      path: path.join(OUT, file),
      fullPage: false,
    });
    console.log("captured", file);
    await page.close();
  }
} finally {
  await browser.close();
}
